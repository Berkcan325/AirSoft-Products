require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3001;

const serviceAccount = require("./airsoftguns-34fbf-firebase-adminsdk-5wafs-fa92d6c8c7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to verify token and set req.uid
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.uid = decodedToken.uid;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  } else {
    res.status(401).send({ error: "No token provided" });
  }
};

// Route to handle profile picture upload
app.post("/uploadProfilePicture", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const { uid } = req.body;

    if (!file) {
      return res.status(400).send({ error: "No file uploaded" });
    }

    const blob = bucket.file(`profile_pictures/${uid}/${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ error: err.message });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).send({ url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to handle password reset email
app.post("/sendPasswordResetEmail", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await admin.auth().getUserByEmail(email);

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click this link to reset your password: ${resetLink}`,
    });

    res.status(200).send({ message: "Password reset email sent successfully" });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      res.status(404).send({ error: "Email not found" });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

// Route to handle fetching favorite items for a user
app.get("/favorites", verifyToken, async (req, res) => {
  try {
    const favoritesSnapshot = await db
      .collection("favorites")
      .doc(req.uid)
      .get();
    if (favoritesSnapshot.exists) {
      res.status(200).send(favoritesSnapshot.data());
    } else {
      res.status(200).send({ favoriteItems: [] });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to handle adding a favorite item for a user
app.post("/favorites", verifyToken, async (req, res) => {
  const { id, productName, imgUrl, price } = req.body;
  try {
    const userFavoritesRef = db.collection("favorites").doc(req.uid);
    const userFavoritesDoc = await userFavoritesRef.get();
    const favorites = userFavoritesDoc.exists
      ? userFavoritesDoc.data().favoriteItems
      : [];

    if (!favorites.some((item) => item.id === id)) {
      favorites.push({ id, productName, imgUrl, price });
      await userFavoritesRef.set({ favoriteItems: favorites });
    }

    res.status(200).send({ message: "Favorite added successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to handle removing a favorite item for a user
app.delete("/favorites", verifyToken, async (req, res) => {
  const { id } = req.body;
  try {
    const userFavoritesRef = db.collection("favorites").doc(req.uid);
    const userFavoritesDoc = await userFavoritesRef.get();
    let favorites = userFavoritesDoc.exists
      ? userFavoritesDoc.data().favoriteItems
      : [];

    favorites = favorites.filter((item) => item.id !== id);
    await userFavoritesRef.set({ favoriteItems: favorites });

    res.status(200).send({ message: "Favorite removed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/sendEmailChangeVerification", verifyToken, async (req, res) => {
  const { newEmail } = req.body;

  try {
    // Generate the email verification link
    const currentUser = await admin.auth().getUser(req.uid);
    const changeEmailLink = `http://localhost:3001/verifyEmailChange?uid=${req.uid}&newEmail=${newEmail}`;

    // Send the verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: currentUser.email,
      subject: "Verify Email Change",
      text: `Click this link to verify your email change: ${changeEmailLink}`,
    });

    res
      .status(200)
      .send({ message: "Email change verification link sent successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to handle verifying the email change
app.get("/verifyEmailChange", async (req, res) => {
  const { uid, newEmail } = req.query;

  try {
    // Update the user's email
    await admin.auth().updateUser(uid, { email: newEmail });

    // Optionally update Firestore user document
    await db.collection("users").doc(uid).update({ email: newEmail });

    res.status(200).send({ message: "Email changed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to delete user
app.post("/deleteUser", async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().deleteUser(uid);
    await db.collection("users").doc(uid).delete();
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
