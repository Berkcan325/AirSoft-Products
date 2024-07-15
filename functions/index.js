/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Check if the request is made by an authenticated user with the admin role
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "Must be an administrative user to initiate delete.",
    );
  }

  const uid = data.uid;

  try {
    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Delete user document from Firestore
    await admin.firestore().collection("users").doc(uid).delete();

    return {message: "Successfully deleted user"};
  } catch (error) {
    throw new functions.https.HttpsError(
        "unknown",
        "Error deleting user",
        error,
    );
  }
});
