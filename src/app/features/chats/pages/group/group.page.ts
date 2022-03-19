import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { AuthService } from '@services/auth/auth.service';
import { ChatService } from '@services/chat/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
  chat$: Observable<Chat & DocumentBase> = null
  userId: string = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const chatId = this.activeRoute.snapshot.paramMap.get('id');
    this.chat$ = this.chatService.loadChat$(chatId);
    this.userId = this.authService.user.uid;
  }
}
