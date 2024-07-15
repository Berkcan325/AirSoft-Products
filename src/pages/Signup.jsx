import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { auth, db, storage } from "../firebase.config";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import userIcon from "../assets/images/default-user-icon.png";
import "../styles/login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    return password.length >= 8 && /\d/.test(password);
  };

  const uploadDefaultImage = async () => {
    const response = await fetch(userIcon); // Fetch the default image
    const blob = await response.blob(); // Convert to blob
    const storageRef = ref(storage, `images/1719779520137-Berkcan.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          reject(error);
        },
        async () => {
          resolve(await getDownloadURL(uploadTask.snapshot.ref));
        }
      );
    });
  };

  const signup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error(
        "Password must be at least 8 characters long and contain a number"
      );
      return;
    }

    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      let downloadURL = null;
      if (file) {
        const storageRef = ref(storage, `images/${Date.now()}-${username}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              reject(error);
            },
            async () => {
              resolve(await getDownloadURL(uploadTask.snapshot.ref));
            }
          );
        });
      } else {
        // Upload the default user icon if no file is provided
        downloadURL = await uploadDefaultImage();
      }

      await updateProfile(user, {
        displayName: username,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: username,
        email,
        role: "user",
        photoURL: downloadURL,
      });

      setLoading(false);
      toast.success("Account created");
      navigate("/home");
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Helmet title="Signup">
      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading...</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Sign Up</h3>
                <Form className="auth__form" onSubmit={signup}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </FormGroup>
                  <button type="submit" className="buy__btn auth__btn">
                    Create an Account
                  </button>
                  <p>
                    Already have an account?{" "}
                    <Link
                      style={{ color: "white", textDecoration: "none" }}
                      to="/login"
                    >
                      Log in
                    </Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
