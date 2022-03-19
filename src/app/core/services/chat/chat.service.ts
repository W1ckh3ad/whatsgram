import { Injectable } from '@angular/core';
import { DocumentReference, limit, orderBy } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { Message } from '@models/message.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { UserService } from '@services/user/user.service';
import { encryptMessage, importPublicKey } from '@utils/crypto.utils';
import {
  getChatDocPath,
  getChatsColPath,
  getMessageColPath,
} from '@utils/db.utils';
import { httpsCallable } from 'firebase/functions';
import { FirestoreService } from '../firestore/firestore.service';

type SendMessageParameterType = {
  messageData: Message;
  sender: WhatsgramUser;
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private senderId: string;
  constructor(
    private db: FirestoreService,
    private cryptoKeys: CryptoKeysService,
    private fns: Functions,
    private account: AccountService,
    private userService: UserService
  ) {
    account.uid$.subscribe((x) => (this.senderId = x));
  }

  loadChat$(chatId: string) {
    return this.db.docWithMetaData$<Chat>(
      getChatDocPath(this.senderId, chatId)
    );
  }

  loadChats$() {
    return this.db.collectionQuery$<Chat>(
      getChatsColPath(this.senderId),
      orderBy('updatedAt'),
      limit(50)
    );
  }

  loadMessages$(id: string) {
    return this.db.collectionQuery$<Message>(
      getMessageColPath(this.senderId, id),
      orderBy('updatedAt')
    );
  }

  async handleSendMessage(chat: Chat & DocumentBase, text: string) {
    const message = {
      text,
      receiverId: chat.id,
      groupId: chat.isGroupChat ? chat.id : null,

      senderId: this.senderId,
    } as Message;
    const refString = getChatDocPath(
      this.senderId,
      message.groupId ?? message.receiverId
    );
    const chatRef = this.db.doc<Chat>(refString);

    const receiverMessagePath = await this.handleGenerationForReceiver(
      message,
      chat.info.publicKey
    );

    const ownMessage = await this.createMessageForSender(
      message,
      receiverMessagePath,
      chatRef
    );
    const data = {
      lastReadMessage: ownMessage.id,
    };
    return this.db.setUpdate(chatRef, data as any, { merge: true });
  }

  /**
   * Erstellt eine Nachricht für den Sender
   * in der Datenbank
   * die Nachricht wird vor dem Speichern verschlüsselt
   * @param message
   * @param receiverMessagePath
   * @param chatRef
   * @returns
   */
  private async createMessageForSender(
    message: Message,
    receiverMessagePath: string | string[],
    chatRef?: DocumentReference<Chat>
  ): Promise<DocumentReference<Message>> {
    try {
      if (!(await this.db.exists(chatRef)) && !message.groupId) {
        const { displayName, publicKey, photoURL, email } =
          await this.userService.load(message.receiverId);

        await this.db.addWithDocumentReference(chatRef, {
          info: {
            displayName,
            photoURL,
            publicKey,
            alt: email,
          },
        });
      }

      const messageObject = {
        ...message,
        receiverMessagePath,
        text: await encryptMessage(
          message.text,
          await this.cryptoKeys.getPublicKey()
        ),
      };

      const messageRef = await this.db.add<Message>(
        getMessageColPath(this.senderId, message.groupId ?? message.receiverId),
        messageObject
      );

      const messageRefData = await this.db.docSnapWithMetaData(messageRef);
      await this.db.setUpdate<DocumentReference<Chat & DocumentBase>>(
        chatRef.path,
        {
          lastMessage: { ...messageRefData },
        },
        { merge: true }
      );

      return messageRef;
    } catch (error) {
      console.error('createMessageForSender error', error);
      throw error;
    }
  }

  /**
   * Erstellt eine nachricht für den Empfänger
   * Dafür wird eine Cloud function verwendet
   * Die nachricht wird vor dem Versenden verschlüsselt
   * @param message
   * @param receiverPublicKey
   * @returns
   */
  private async createMessageForSingleReceiver(
    message: Message,
    receiverPublicKey: string = null
  ) {
    try {
      if (!receiverPublicKey) {
        receiverPublicKey = (await this.userService.load(message.receiverId))
          .publicKey;
      }
      const messageData: Message = {
        ...message,
        text: await encryptMessage(
          message.text,
          await importPublicKey(receiverPublicKey)
        ),
      };
      const callable = httpsCallable<SendMessageParameterType, string>(
        this.fns,
        'sendMessage'
      );
      return (
        await callable({
          messageData,
          sender: await this.account.loadSnapUser(),
        })
      ).data;
    } catch (error) {
      console.error('createMessageForSingleReceiver', error);
      throw error;
    }
  }

  /**
   *
   * @param message
   * @param receiverPublicKey
   * @returns
   */
  private async handleGenerationForReceiver(
    message: Message,
    receiverPublicKey?: string
  ) {
    if (message.groupId) {
      return this.createMessageForEveryGroupMember(message);
    }
    return this.createMessageForSingleReceiver(message, receiverPublicKey);
  }

  /**
   *
   * @param message
   * @returns
   */
  private async createMessageForEveryGroupMember(
    message: Message
  ): Promise<string[]> {
    try {
      const group: {
        members: DocumentReference<WhatsgramUser & DocumentBase>[];
        admins: DocumentReference<WhatsgramUser & DocumentBase>[];
      } = { members: [], admins: [] };
      alert('Group Service missing');
      const promises: Promise<string>[] = [];
      for (const member of [...group.members, ...group.admins]) {
        const data = await this.db.docSnap<WhatsgramUser & DocumentBase>(
          member
        );
        promises.push(
          this.createMessageForSingleReceiver(
            { ...message, receiverId: data.id },
            data.publicKey
          )
        );
      }

      return await Promise.all(promises);
    } catch (error) {
      console.error('createMessageForEveryGroupMember error', error);
      throw error;
    }
  }
}
