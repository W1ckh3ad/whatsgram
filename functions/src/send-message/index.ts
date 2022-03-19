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

admin.initializeApp();

type SendMessageType = {
  messageData: Message;
  sender: WhatsgramUser;
};

export const sendMessage = functions.https.onCall(
    async ({messageData, sender}: SendMessageType, context) => {
      if (!context.auth?.uid) {
        throw new Error("User isnt authenticated");
      }
      const {
        receiverId,
        senderId,
        text,
        groupId,
        mediaPath,
        receiverMessagePath,
        responseToId,
      } = messageData;
      const db = admin.firestore();
      const fcm = admin.messaging();
      const chatRef = db.doc(getChatDocPath(receiverId, groupId ?? senderId));

      const chatDocData = await chatRef.get();
      let ts = admin.firestore.Timestamp.now();

      const chatDocDataBody: Chat & Omit<DocumentBase, "id"> = {
        info: {
          displayName: sender.displayName,
          photoURL: sender.photoURL,
          publicKey: sender.publicKey,
        },
        isGroupChat: !!groupId,
        createdAt: ts,
        updatedAt: ts,
      };
      if (!chatDocData.exists) {
        chatRef.create(chatDocDataBody);
      }

      const messageCol = db.collection(
          getMessageColPath(receiverId, groupId ?? senderId)
      );
      ts = admin.firestore.Timestamp.now();
      const messageBody = {
        receiverId,
        senderId,
        text,
        groupId,
        mediaPath,
        receiverMessagePath,
        responseToId,
        createdAt: ts,
        updatedAt: ts,
      } as Message & DocumentBase;
      const message = await messageCol.add(messageBody);


      chatDocDataBody.updatedAt = ts;
      messageBody.id = message.id;
      chatDocDataBody.lastMessage = messageBody;

      chatRef.update(chatDocDataBody);

      const notification: admin.messaging.MessagingPayload = {
        notification: {
          title: `'${sender.displayName}'`,
          body: text,
          icon: sender.photoURL,
        },
      };

      const devices = await db.collection(getDevicesColPath(receiverId)).get();
      const tokens: string[] = [];

      devices.forEach((result) => {
        const token = result.data().token;
        tokens.push(token);
      });

      fcm.sendToDevice(tokens, notification);

      return message.path;
    }
);
