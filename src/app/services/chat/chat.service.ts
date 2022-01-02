import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { FirestoreService } from '../firestore/firestore.service';
import { Message } from './message.model';
import { guid } from 'src/utils';
import { CryptoService } from '../crypto/crypto.service';
import { UserService } from '../user/user.service';
import { User } from '../account/user.model';

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
    publicKey: string,
    uid: string
  ): Promise<DocumentReference<Message>> {
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
      responseTo: this.db.getMessageDoc(responseTo),
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
    const { publicKey } = await this.user.loadSnap(receiverUid);
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
      responseTo: this.db.getMessageDoc(responseTo),
      groupId,
    });
    return messageDoc;
  }

  async createMessageForEveryGroupMember(
    msg: string,
    responseTo: string = null,
    groupId: string = null,
    uid: string
  ) {
    const group: {
      members: DocumentReference<User>[];
      admins: DocumentReference<User>[];
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
}
