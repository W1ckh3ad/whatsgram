import { Component, OnInit } from '@angular/core';
import { ChatService } from '@services/chat/chat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatForDisplay } from './model/chat-for-display.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats$: Observable<ChatForDisplay[]>;
  privateKey: CryptoKey;

  constructor(private chat: ChatService) {}

  async ngOnInit() {
    this.chats$ = this.chat.loadChats().pipe(
      map((x) =>
        x.map(
          (x) =>
            ({
              displayName: 'Dummy',
              photoURL: 'F',
              id: x.id,
              unread: 5,
              lastMessage: {
                createdAt: x.createdAt,
                isRead: true,
                text: 'Test',
              },
            } as ChatForDisplay)
        )
      )
    );
  }
}
