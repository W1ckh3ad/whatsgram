import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { Message } from '@models/message.model';
import { AuthService } from '@services/auth/auth.service';
import { ChatService } from '@services/chat/chat.service';
import { UserService } from '@services/user/user.service';
import { DocumentReference } from 'firebase/firestore';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.page.html',
  styleUrls: ['./single-chat.page.scss'],
})
export class SingleChatPage implements OnInit {
  message$: Observable<(Message & DocumentBase)[]>;
  unreadMessageRefs$: Observable<DocumentReference<Message>[]>;
  readMessage: { createdAt: number; id: string } = null;
  timeout: any;
  userId: string = null;

  chat$: Observable<Chat & DocumentBase> = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    const chatId = this.activeRoute.snapshot.paramMap.get('id');
    this.chat$ = this.chatService.loadChat$(chatId).pipe(
      switchMap(async (x) => {
        if (!x) {
          const user = await this.userService.load(chatId);
          if (user.createdAt) {
            const { email, displayName, photoURL, publicKey } = user;
            return {
              info: { alt: email, displayName, photoURL, publicKey },
              id: chatId,
            } as Chat & DocumentBase;
          } else {
            this.router.navigateByUrl('/chats');
          }
        }
        return x;
      })
    );
    this.message$ = this.chatService.loadMessages$(chatId);
    this.userId = this.authService.user.uid;
  }

  openGroup(isGroupChat?: boolean) {
    if (isGroupChat) {
      this.router.navigateByUrl(location.pathname + '/group');
    }
  }
}
