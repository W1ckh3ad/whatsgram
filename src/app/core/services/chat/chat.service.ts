import { Injectable } from '@angular/core';
import { DocumentReference, limit, orderBy } from '@angular/fire/firestore';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { AccountService } from '@services/account/account.service';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { encryptMessage } from '@utils/crypto.utils';
import {
  getChatDocPath,
  getChatsColPath,
  getMessageColPath,
} from '@utils/db.utils';
import { Message } from '@models/message.model';
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
      getChatsColPath(this.senderId),
      orderBy('updatedAt'),
      limit(50)
    );
  }

  loadMessages(id: string) {
    return this.db.collection$<Message>(getMessageColPath(this.senderId, id));
  }

  async handleSendMessage(
    msg: string,
    receiverUid: string,
    responseTo: string = null,
    groupId: string = null
  ) {
    const chatOrGroupId = groupId ?? receiverUid;

    const refString = getChatDocPath(this.senderId, chatOrGroupId);
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
      return this.db.update(chatRef, data as any);
    }
    return this.db.addWithDocumentReference(chatRef, data as any);
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
        getMessageColPath(this.senderId, groupId ?? receiverId),
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
          getMessageColPath(receiverId, groupId ?? this.senderId),
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
}
