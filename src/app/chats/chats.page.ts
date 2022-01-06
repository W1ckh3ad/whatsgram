import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../services/account/account.service';
import { Chat } from '../services/account/chat-model';
import { Inbox } from '../services/account/inbox.model';
import { PrivateData } from '../services/account/private-data.model';
import { FirestoreService } from '../services/firestore/firestore.service';
import { ChatForDisplay } from './chat-for-display.model';

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

    readChats.subscribe((x) => console.log(x));
    unreadChats.subscribe((x) => console.log(x));
    this.chats$ = combineLatest([readChats, unreadChats]).pipe(
      map((array: [PrivateData, Inbox]) => {
        const chatsList: ChatForDisplay[][] = [];
        debugger;
        for (const storage of array) {
          const list = [];
          const { chats } = storage;
          if (chats) {
            for (const uid of Object.keys(chats)) {
              list.push(this.transform(uid, chats, storage));
            }
          }
          chatsList.push(list);
        }
        for (const chat of chatsList[1]) {
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
    uid: string,
    chats: { [uid: string]: Chat },
    storage: any
  ): ChatForDisplay {
    return {
      uid,
      updatedAt: chats[uid].updatedAt,
      userRef: this.db.getUsersDoc(uid),
      lastMessageRef: chats[uid].messages[chats[uid].messages.length - 1],
      unread: storage instanceof Inbox ? chats[uid].messages.length : undefined,
    };
  }
}
