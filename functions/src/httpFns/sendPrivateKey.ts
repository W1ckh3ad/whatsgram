import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {Device} from "src/models/device.model";
import {DocumentBase} from "src/models/document-base.model";
import {getDeviceDocPath} from "../utils/db.utils";

export const sendPrivateKey = functions
    .region("europe-west3")
    .https.onCall(
        async (
            {
              keys,
              senderDeviceId,
              receiverDeviceId,
            }: { keys: string[]; senderDeviceId: string; receiverDeviceId: string },
            context
        ) => {
          if (!context.auth?.uid) {
            throw new Error("User isnt authenticated");
          }
          const senderId = context.auth.uid;
          console.log(
              "Call send private keys",
              senderId,
              keys,
              senderDeviceId,
              receiverDeviceId
          );

          const db = admin.firestore();
          const fcm = admin.messaging();

          const [senderDevice, receiverDevice] = await Promise.all([
            db
                .doc(getDeviceDocPath(senderId, senderDeviceId))
                .get()
                .then((d) => d.data() as Device & DocumentBase),
            db
                .doc(getDeviceDocPath(senderId, receiverDeviceId))
                .get()
                .then((d) => d.data() as Device & DocumentBase),
          ]);

          if (!(senderDevice && senderDevice.isMainDevice && receiverDevice)) {
            console.error("send private key error", senderDevice, receiverDevice);
            throw new Error("send private key error");
          }
          const message: admin.messaging.MessagingPayload = {
            notification: {
              title: "'System'",
              body: "Your device is registered successfully",
            },
            data: {
              type: "privateKey",
              key: keys.join("|"),
            },
          };
          console.log("send message to", receiverDeviceId, message);
          await fcm.sendToDevice(receiverDeviceId, message);
          console.log("message send");
          return "Success";
        }
    );
