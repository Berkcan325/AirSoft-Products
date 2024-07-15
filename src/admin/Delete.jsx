import { FirebaseError } from "firebase/app";
import { auth } from "../firebase.config";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";

export const deleteUserFromFirestore = async (user) => {
  if (!user || user === null) return;
  try {
    const userEmail = user.email;
    const credential = EmailAuthProvider.credential(userEmail);
    await reauthenticateWithCredential(user, credential);
    await deleteUser(user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.log("error");
      return;
    }
    console.error("User cant delete", error);
  }
};
