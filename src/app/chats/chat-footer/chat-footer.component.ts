import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account/account.service';

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
  constructor(private accountService: AccountService) {}

  ngOnInit() {}

  send() {
    if (this.message === '') {
      return;
    }
    this.accountService
      .sendMessage(this.message, this.receiverId, this.responseTo, this.groupId)
      .then(() => {
        this.message = '';
        this.responseTo = '';
      });
  }
}
