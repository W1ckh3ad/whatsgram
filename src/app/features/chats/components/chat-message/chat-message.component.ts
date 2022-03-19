import { Component, Input, OnInit } from '@angular/core';
import { DocumentBase } from '@models/document-base.model';
import { Message } from '@models/message.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message & DocumentBase = null;
  @Input() userId: string = null;

  constructor() {
  }

  ngOnInit() {}
}
