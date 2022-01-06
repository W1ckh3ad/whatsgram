import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { FirestoreService } from '../firestore/firestore.service';
import { Message } from './message.model';
import { guid } from 'src/utils';
import { CryptoService } from '../crypto/crypto.service';
import { UserService } from '../user/user.service';
import { WhatsgramUser } from '../account/whatsgram.user.model';
import { Inbox } from '../account/inbox.model';
import { where } from 'firebase/firestore';

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
    uid: string
  ): Promise<DocumentReference<Message>> {
    const messageGuid = guid();
    const messageDoc = this.db.getMessageDoc(messageGuid);

    this.db.set(messageDoc, {
      createdAt: this.db.timestamp,
      guid: messageGuid,
      receiver: this.db.getUsersDoc(receiverUid),
      sender: this.db.getUsersDoc(uid),
      text: await this.crypto.encryptMessage(msg, publicKey),
      responseTo: responseTo ? this.db.getMessageDoc(responseTo) : null,
      groupId,
    });
    return messageDoc;
  }

  async createMessageForSingleReceiver(
    msg: string,
    receiverUid: string,
    responseTo: string = null,
    groupId: string = null,
    uid: string
  ) {
    const inboxDoc = this.db.getInboxDoc(receiverUid);
    const [{ publicKey }, inboxSnap] = await Promise.all([
      this.user.loadSnap(receiverUid),
      this.db.docSnap(inboxDoc),
    ]);
    const messageGuid = guid();
    const messageDoc = this.db.getMessageDoc(messageGuid);
    this.db.set(messageDoc, {
      createdAt: this.db.timestamp,
      guid: messageGuid,
      receiverId: this.db.getUsersDoc(receiverUid),
      senderId: this.db.getUsersDoc(uid),
      text: await this.crypto.encryptMessage(
        msg,
        await this.crypto.importPublicKey(publicKey)
      ),
      responseTo: responseTo && this.db.getMessageDoc(responseTo),
      groupId,
    });

    const newInbox = this.getInboxDoc(inboxSnap, messageDoc, uid, groupId);
    this.db.update(inboxDoc, newInbox);
    return messageDoc;
  }

  async createMessageForEveryGroupMember(
    msg: string,
    responseTo: string = null,
    groupId: string = null,
    uid: string
  ) {
    const group: {
      members: DocumentReference<WhatsgramUser>[];
      admins: DocumentReference<WhatsgramUser>[];
    } = { members: [], admins: [] };
    alert('Group Service missing');
    const promises = [];
    for (const member of [...group.members, ...group.admins]) {
      promises.push(
        this.createMessageForSingleReceiver(
          msg,
          member.id,
          responseTo,
          groupId,
          uid
        )
      );
    }

    await Promise.all(promises);
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
    uid: string,
    groupId: string | null = null
  ) {
    const alreadExists = groupId
      ? Object.keys(snap.groups).includes(groupId)
      : Object.keys(snap.chats).includes(uid);
    let obj: Inbox = (
      groupId
        ? {
            ...snap.chats,
            groups: {
              ...snap.groups,
              [groupId]: {
                updatedAt: this.db.timestamp,
                createdAt: alreadExists
                  ? snap.groups[uid].createdAt
                  : this.db.timestamp,
                messages: [
                  ...(alreadExists ? snap.groups[uid].messages : []),
                  messageDoc,
                ],
              },
            },
          }
        : {
            ...snap.groups,
            chats: {
              ...snap.chats,
              [uid]: {
                updatedAt: this.db.timestamp,
                createdAt: alreadExists
                  ? snap.chats[uid].createdAt
                  : this.db.timestamp,
                messages: [
                  ...(alreadExists ? snap.chats[uid].messages : []),
                  messageDoc,
                ],
              },
            },
          }
    ) as Inbox;
    if (!obj.chats) {
      obj.chats = {};
    }
    if (!obj.groups) {
      obj.groups = {};
    }
    return obj;
  }
}
