import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '@services/chat/chat.service';

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.scss'],
})
export class ChatFooterComponent implements OnInit {
  @Input() responseTo: string = '';
  @Input() message: string = '';
  @Input() receiverId: string = '';
  @Input() groupId: string = null;
  constructor(private chat: ChatService) {}

  ngOnInit() {}

  send() {
    if (this.message === '') {
      return;
    }
    this.chat
      .handleSendMessage(
        this.message,
        this.receiverId,
        this.responseTo,
        this.groupId
      )
      .then(() => {
        this.message = '';
        this.responseTo = '';
      });
  }
}
