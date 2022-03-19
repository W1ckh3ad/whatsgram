import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { ChatService } from '@services/chat/chat.service';

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.scss'],
})
export class ChatFooterComponent implements OnInit {
  @Input() message: string = '';
  @Input() chat: Chat & DocumentBase;
  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  send() {
    if (this.message === '') {
      return;
    }
    this.chatService
      .handleSendMessage(
        this.chat,
        this.message
      )
      .then(() => {
        this.message = '';
      })
      .catch((e) => console.error('Loading Settings/Profile error', e));
  }
}
