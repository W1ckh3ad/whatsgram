import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '@services/chat/chat.service';

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.scss'],
})
export class ChatFooterComponent implements OnInit {
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
      .handleSendMessage({
        receiverId: this.receiverId,
        text: this.message,
        groupId: this.groupId,
      })
      .then(() => {
        this.message = '';
      })
      .catch((e) => console.error('Loading Settings/Profile error', e));
  }
}
