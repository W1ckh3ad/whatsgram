import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../services/account/account.service';
import { Chat } from '../services/account/chat-model';
import { Inbox } from '../services/account/inbox.model';
import { PrivateData } from '../services/account/private-data.model';
import { FirestoreService } from '../services/firestore/firestore.service';
import { ChatForDisplay } from '../../model/chat-for-display.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats$: Observable<ChatForDisplay[]>;
  privateKey: CryptoKey;

  constructor(private account: AccountService, private db: FirestoreService) {}

  async ngOnInit() {
    const readChats = this.account.privateData;
    const unreadChats = this.account.inbox;

    this.chats$ = combineLatest([readChats, unreadChats]).pipe(
      map((array: [PrivateData, Inbox]) => {
        const chatsList: ChatForDisplay[][] = [];

        for (let i = 0; i < array.length; i++) {
          const storage = array[i];
          const list = [];
          const { chats } = storage;
          if (chats) {
            for (const uid of Object.keys(chats)) {
              list.push(this.transform(uid, chats, i === 1));
            }
          }
          chatsList.push(list);
        }
        for (const chat of chatsList[1]) {
          if (!chat.lastMessageRef) {
            continue;
          }
          const index = chatsList[0].findIndex((x) => x.uid === chat.uid);
          if (index !== -1) {
            chatsList[0].splice(index, 1, chat);
          } else {
            chatsList[0].push(chat);
          }
        }
        return [
          ...chatsList[0].sort(
            (a, b) => b.updatedAt.seconds - a.updatedAt.seconds
          ),
        ];
      })
    );
  }
  private transform(
    partnerIid: string,
    chats: { [uid: string]: Chat },
    isInbox: boolean
  ): ChatForDisplay {
    return {
      uid: partnerIid,
      updatedAt: chats[partnerIid].updatedAt,
      userRef: this.db.getUsersDoc(partnerIid),
      lastMessageRef:
        chats[partnerIid].messageRefs.length > 0
          ? chats[partnerIid].messageRefs[
              chats[partnerIid].messageRefs.length - 1
            ]
          : undefined,
      unread: isInbox ? chats[partnerIid].messageRefs.length : undefined,
    };
  }
}
