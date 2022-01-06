import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/services/chat/message.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() message$: Observable<Message> = null;
  @Input() receiverId: string;

  constructor() {}

  ngOnInit() {}
}
