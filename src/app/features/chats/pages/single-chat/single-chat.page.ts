import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { Message } from '@models/message.model';
import { AuthService } from '@services/auth/auth.service';
import { ChatService } from '@services/chat/chat.service';
import { DocumentReference } from 'firebase/firestore';
import { Observable } from 'rxjs';

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
    private router: Router
  ) {}

  async ngOnInit() {
    const chatId = this.activeRoute.snapshot.paramMap.get('id');
    this.chat$ = this.chatService.loadChat$(chatId);
    this.message$ = this.chatService.loadMessages$(chatId);
    this.userId = this.authService.user.uid;
  }

  openGroup(isGroupChat?: boolean) {
    if (isGroupChat) {
      this.router.navigateByUrl(location.pathname + '/group');
    }
  }
}
