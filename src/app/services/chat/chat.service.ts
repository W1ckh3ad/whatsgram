import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { FirestoreService } from '../firestore/firestore.service';
import { GroupReceiverMessageRef, Message } from './message.model';
import { guid } from 'src/utils';
import { CryptoService } from '../crypto/crypto.service';
import { UserService } from '../user/user.service';
import { WhatsgramUser } from '../account/whatsgram.user.model';
import { Inbox } from '../account/inbox.model';
import { where } from 'firebase/firestore';
import { Chat } from '../account/chat-model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private db: FirestoreService,
    private crypto: CryptoService,
    private user: UserService
  ) {}

  async createMessageForSender(
    msg: string,
    receiverUid: string,
    responseTo: string = null,
    groupId: string = null,
    publicKey: CryptoKey,
    senderUid: string
  ): Promise<DocumentReference<Message>> {
    const messageGuid = guid();
    const messageDoc = this.db.getMessageDoc(messageGuid);
    const message: Message = {
      createdAt: this.db.timestamp,
      guid: messageGuid,
      receiverRef: this.db.getUsersDoc(receiverUid),
      senderRef: this.db.getUsersDoc(senderUid),
      text: await this.crypto.encryptMessage(msg, publicKey),
      responseToRef: responseTo ? this.db.getMessageDoc(responseTo) : null,
    };
    if (groupId) {
      message.groupReceiverMessageRefs =
        await this.createMessageForEveryGroupMember(
          msg,
          responseTo,
          groupId,
          senderUid
        );
    } else {
      message.receiverMessageRef = await this.createMessageForSingleReceiver(
        msg,
        receiverUid,
        responseTo,
        groupId,
        senderUid
      );
    }
    this.db.set(messageDoc, message);
    return messageDoc;
  }

  private async createMessageForSingleReceiver(
    msg: string,
    receiverId: string,
    responseTo: string = null,
    groupId: string = null,
    senderId: string
  ) {
    const inboxDoc = this.db.getInboxDoc(receiverId);
    const [{ publicKey }, inboxSnap] = await Promise.all([
      this.user.loadSnap(receiverId),
      this.db.docSnap(inboxDoc),
    ]);
    const messageGuid = guid();
    const messageDoc = this.db.getMessageDoc(messageGuid);
    this.db.set(messageDoc, {
      createdAt: this.db.timestamp,
      guid: messageGuid,
      receiverRef: this.db.getUsersDoc(receiverId),
      senderRef: this.db.getUsersDoc(senderId),
      text: await this.crypto.encryptMessage(
        msg,
        await this.crypto.importPublicKey(publicKey)
      ),
      responseToRef: responseTo && this.db.getMessageDoc(responseTo),
      groupId,
    });

    const newInbox = this.getInboxDoc(inboxSnap, messageDoc, senderId, groupId);
    this.db.update(inboxDoc, newInbox);
    return messageDoc;
  }

  private async createMessageForEveryGroupMember(
    msg: string,
    responseTo: string = null,
    groupId: string = null,
    senderUid: string
  ): Promise<GroupReceiverMessageRef[]> {
    const group: {
      members: DocumentReference<WhatsgramUser>[];
      admins: DocumentReference<WhatsgramUser>[];
    } = { members: [], admins: [] };
    alert('Group Service missing');
    const promises: Promise<DocumentReference<Message>>[] = [];
    const users: DocumentReference<WhatsgramUser>[] = [];
    for (const member of [...group.members, ...group.admins]) {
      users.push(member);
      promises.push(
        this.createMessageForSingleReceiver(
          msg,
          member.id,
          responseTo,
          groupId,
          senderUid
        )
      );
    }

    const res = await Promise.all(promises);
    return res.map((x, i) => ({ userRef: users[i], messageRef: x }));
  }

  loadList(ids: string[]) {
    return this.db.collectionQuery$(
      this.db.collection('messages'),
      where('guid', 'in', ids)
    );
  }

  private getInboxDoc(
    snap: Inbox,
    messageDoc: DocumentReference<Message>,
    senderId: string,
    groupId: string | null = null
  ) {
    const alreadExists = groupId
      ? Object.keys(snap.groups).includes(groupId)
      : Object.keys(snap.chats).includes(senderId);
    let obj: Inbox = groupId
      ? {
          chats: { ...snap.chats },
          groups: {
            ...snap.groups,
            [groupId]: {
              updatedAt: this.db.timestamp,
              createdAt: alreadExists
                ? snap.groups[groupId].createdAt
                : this.db.timestamp,
              messageRefs: [
                ...(alreadExists ? snap.groups[groupId].messageRefs : []),
                messageDoc,
              ],
            } as Chat,
          },
        }
      : {
          groups: { ...snap.groups },
          chats: {
            ...snap.chats,
            [senderId]: {
              updatedAt: this.db.timestamp,
              createdAt: alreadExists
                ? snap.chats[senderId].createdAt
                : this.db.timestamp,
              messageRefs: [
                ...(alreadExists ? snap.chats[senderId].messageRefs : []),
                messageDoc,
              ],
            } as Chat,
          },
        };
    if (!obj.chats) {
      obj.chats = {};
    }
    if (!obj.groups) {
      obj.groups = {};
    }
    return obj;
  }
}
