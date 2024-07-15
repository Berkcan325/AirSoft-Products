import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const checkUserRole = async (uid) => {
  console.log("Checking role for UID:", uid);
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    console.log("User doc data:", userDoc.data());
    return userDoc.data().role;
  } else {
    throw new Error("User does not exist");
  }
};

export default checkUserRole;
