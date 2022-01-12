import { Injectable } from '@angular/core';
import { DocumentReference, orderBy, limit } from '@angular/fire/firestore';
import { chats, messages, users } from '@constants/collection-names';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { AccountService } from '@services/account/account.service';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { Message } from '../../models/message.model';
import { encryptMessage } from '../../utls/crypto.utils';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private senderId: string;
  constructor(
    private db: FirestoreService,
    private cryptoKeys: CryptoKeysService,
    account: AccountService
  ) {
    account.uid$.subscribe((x) => (this.senderId = x));
  }

  loadChats() {
    return this.db.collectionQuery$<Chat>(
      this.getUserChatsCollection(this.senderId),
      orderBy('updatedAt'),
      limit(50)
    );
  }

  loadMessages(id: string) {
    return this.db.collection$<Message>(
      this.getUserMessageCollection(this.senderId, id)
    );
  }

  async handleSendMessage(
    msg: string,
    receiverUid: string,
    responseTo: string = null,
    groupId: string = null
  ) {
    const chatOrGroupId = groupId ?? receiverUid;
    const refString = `${users}/${this.senderId}/${chats}/${chatOrGroupId}`;
    const chatRef = this.db.doc<Chat>(refString);

    const ownMessage = await this.createMessageForSender(
      msg,
      receiverUid,
      responseTo,
      groupId,
      await this.handleGenerationForReceiver(
        msg,
        receiverUid,
        responseTo,
        groupId
      )
    );
    const data = {
      lastReadMessage: ownMessage.id,
    };
    if (await this.db.exists(chatRef)) {
      return this.db.update(chatRef, data);
    }
    return this.db.addWithDocumentReference(chatRef, data);
  }

  private async createMessageForSender(
    msg: string,
    receiverId: string,
    responseTo: string = null,
    groupId: string = null,
    receiverMessageIds: string | string[]
  ): Promise<DocumentReference<Message>> {
    try {
      const message: Message = {
        receiverId: receiverId,
        senderId: this.senderId,
        text: await encryptMessage(msg, await this.cryptoKeys.getPublicKey()),
        responseToId: responseTo ? responseTo : null,
        receiverMessagePath: receiverMessageIds,
        groupId,
      };

      return this.db.add<Message>(
        this.getUserMessageCollection(this.senderId, groupId ?? receiverId),
        message
      );
    } catch (error) {
      console.error('createMessageForSender error', error);
      throw error;
    }
  }

  private async createMessageForSingleReceiver(
    msg: string,
    receiverId: string,
    responseTo: string = null,
    groupId: string = null
  ) {
    try {
      return (
        await this.db.add(
          this.getUserMessageCollection(receiverId, groupId ?? this.senderId),
          {
            receiverId: receiverId,
            senderId: this.senderId,
            text: await encryptMessage(
              msg,
              await this.cryptoKeys.getPublicKey()
            ),
            responseToRef: responseTo,
            groupId,
          }
        )
      ).id;
    } catch (error) {
      console.error('createMessageForSingleReceiver', error);
      throw error;
    }
  }

  private async handleGenerationForReceiver(
    msg: string,
    receiverUid: string,
    responseTo: string = null,
    groupId: string = null
  ) {
    if (groupId) {
      return this.createMessageForEveryGroupMember(msg, responseTo, groupId);
    }
    return this.createMessageForSingleReceiver(
      msg,
      receiverUid,
      responseTo,
      groupId
    );
  }

  private async createMessageForEveryGroupMember(
    msg: string,
    responseTo: string = null,
    groupId: string = null
  ): Promise<string[]> {
    try {
      const group: {
        members: DocumentReference<DocumentBase>[];
        admins: DocumentReference<DocumentBase>[];
      } = { members: [], admins: [] };
      alert('Group Service missing');
      const promises: Promise<string>[] = [];
      for (const member of [...group.members, ...group.admins]) {
        promises.push(
          this.createMessageForSingleReceiver(
            msg,
            member.id,
            responseTo,
            groupId
          )
        );
      }

      return await Promise.all(promises);
    } catch (error) {
      console.error('createMessageForEveryGroupMember error', error);
      throw error;
    }
  }

  private getUserMessageCollection(userId: string, id: string) {
    return `${this.getUserChatDocument(userId, id)}/${messages}`;
  }

  private getUserChatDocument(userId: string, documentId: string) {
    return `${this.getUserChatsCollection(userId)}/${documentId}`;
  }

  private getUserChatsCollection(userId: string) {
    return `${users}/${userId}/${chats}`;
  }
}
