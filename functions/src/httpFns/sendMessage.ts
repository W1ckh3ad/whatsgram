import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {DocumentBase} from "src/models/document-base.model";
import {Message} from "src/models/message.model";
import {WhatsgramUser} from "src/models/whatsgram.user.model";
import {Chat} from "../models/chat.model";
import {
  getChatDocPath,
  getDevicesColPath,
  getMessageColPath,
} from "../utils/db.utils";

type SendMessageType = {
  messageData: Message;
  sender: WhatsgramUser;
};

export const sendMessage = functions
    .region("europe-west3")
    .https.onCall(async ({messageData, sender}: SendMessageType, context) => {
      try {
        if (!context.auth?.uid) {
          throw new Error("User isnt authenticated");
        }
        const {receiverId, senderId, text, groupId, mediaPath} = messageData;
        const db = admin.firestore();
        const fcm = admin.messaging();
        const chatRef = db.doc(getChatDocPath(receiverId, groupId ?? senderId));

        const chatDocData = await chatRef.get();
        let ts = admin.firestore.Timestamp.now();

        const chatDocDataBody: Chat & DocumentBase = {
          info: {
            displayName: sender.displayName,
            photoURL: sender.photoURL,
            publicKey: sender.publicKey,
            description: sender.description,
            alt: sender.email,
          },
          isGroupChat: !!groupId,
          createdAt: ts,
          updatedAt: ts,
          id: groupId ?? senderId,
        };
        if (!chatDocData.exists) {
          chatRef.create(chatDocDataBody);
        }

        const messageCol = db.collection(
            getMessageColPath(receiverId, groupId ?? senderId)
        );
        ts = admin.firestore.Timestamp.now();
        const messageBody = {
          ...messageData,
          mediaPath: mediaPath ?? null,
          createdAt: ts,
          updatedAt: ts,
        } as Message & DocumentBase;
        const message = await messageCol.add(messageBody);

        messageBody.id = message.id;
        chatRef.set(
            {
              updatedAt: ts,
              lastMessage: messageBody,
            },
            {
              merge: true,
            }
        );

        const notification: admin.messaging.MessagingPayload = {
          notification: {
            title: `'${sender.displayName}'`,
            body: text,
            icon: sender.photoURL,
          },
          data: {
            type: "notification"
          }
        };

        const devices = await db.collection(getDevicesColPath(receiverId)).get();
        const tokens: string[] = [];

        devices.forEach((result) => {
          const token = result.data().token;
          tokens.push(token);
        });

        fcm.sendToDevice(tokens, notification);

        return message.path;
      } catch (error) {
        console.error(error);
        return "";
      }
    });
