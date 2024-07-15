import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import {
  getAuth,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase.config";
import { toast } from "react-toastify";
import axios from "axios";
import userIcon from "../assets/images/default-user-icon.png";

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState({
    displayName: "",
    photoURL: "",
    email: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    profilePicture: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData({ ...userDoc.data(), email: user.email });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setUserData({ ...userData, profilePicture: e.target.files[0] });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      let photoURL = user.photoURL;

      if (userData.profilePicture) {
        // Upload profile picture logic
        const storageRef = ref(storage, `images/${Date.now()}-${user.uid}`);
        const uploadTask = uploadBytesResumable(
          storageRef,
          userData.profilePicture
        );

        photoURL = await new Promise((resolve, reject) => {
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

        // Delete old profile picture if it exists and is not the default user icon
        if (user.photoURL && user.photoURL !== userIcon) {
          const oldImageRef = ref(storage, user.photoURL);
          deleteObject(oldImageRef).catch((error) => {
            console.error("Error deleting old profile picture:", error);
          });
        }
      }

      if (
        userData.displayName !== user.displayName ||
        photoURL !== user.photoURL
      ) {
        await updateProfile(user, {
          displayName: userData.displayName,
          photoURL: photoURL,
        });
      }

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: userData.displayName,
        photoURL: photoURL,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        userData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, userData.newPassword);
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Error updating password: " + error.message);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();

    try {
      const idToken = await user.getIdToken();
      const response = await axios.post(
        "http://localhost:3001/sendEmailChangeVerification",
        { newEmail: userData.newEmail },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      toast.success("Email verification link sent to your current email!");
    } catch (error) {
      toast.error("Error updating email: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const idToken = await user.getIdToken();
      await deleteDoc(doc(db, "users", user.uid));
      await axios.post(
        "http://localhost:3001/deleteUser",
        { uid: user.uid },
        { headers: { Authorization: idToken } }
      );
      await user.delete();
    } catch (error) {
      toast.success("Account deleted successfully!");
      navigate("/home");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h4 className="fw-bold">Profile</h4>
          </Col>
          <Col lg="12" className="pt-5">
            <Form onSubmit={handleProfileUpdate}>
              <FormGroup>
                <Label for="displayName">Name</Label>
                <Input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={userData.displayName}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="photoURL">Profile Picture URL</Label>
                <Input
                  type="text"
                  name="photoURL"
                  id="photoURL"
                  value={userData.photoURL}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="profilePicture">Upload Profile Picture</Label>
                <Input
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                  onChange={handleFileChange}
                />
              </FormGroup>
              <Button type="submit" color="primary">
                Update Profile
              </Button>
            </Form>
            <Form onSubmit={handlePasswordChange} className="mt-4">
              <FormGroup>
                <Label for="currentPassword">Current Password</Label>
                <Input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={userData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="newPassword">New Password</Label>
                <Input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={userData.newPassword}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <Button type="submit" color="primary">
                Change Password
              </Button>
            </Form>
            <Form onSubmit={handleEmailChange} className="mt-4">
              <FormGroup>
                <Label for="newEmail">New Email</Label>
                <Input
                  type="email"
                  name="newEmail"
                  id="newEmail"
                  value={userData.newEmail}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <Button type="submit" color="primary">
                Change Email
              </Button>
            </Form>
            <Button
              color="danger"
              className="mt-4"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Profile;
