import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const sendMessage = functions.https.onCall(
    async (data: {}, context) => {}
);
