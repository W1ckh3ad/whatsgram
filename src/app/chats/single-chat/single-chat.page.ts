import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentReference } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account/account.service';
import { WhatsgramUser } from 'src/app/services/account/whatsgram.user.model';
import { Message } from 'src/app/services/chat/message.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.page.html',
  styleUrls: ['./single-chat.page.scss'],
})
export class SingleChatPage implements OnInit {
  receiverId: string;
  responseTo: string = null;
  messageRefs$: Observable<DocumentReference<Message>[]>;
  unreadMessageRefs$: Observable<DocumentReference<Message>[]>;
  receiver$: Observable<WhatsgramUser>;
  readMessages: string[] = [];
  timeout: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.receiverId = this.activeRoute.snapshot.paramMap.get('id');
    this.messageRefs$ = this.accountService.privateData.pipe(
      map((x) =>
        x.chats[this.receiverId] ? x.chats[this.receiverId].messageRefs : []
      )
    );
    this.unreadMessageRefs$ = this.accountService.inbox.pipe(
      map((x) =>
        x.chats[this.receiverId] ? x.chats[this.receiverId].messageRefs : []
      )
    );
    this.receiver$ = this.userService.load(this.receiverId);
  }

  onVisible(target) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      console.log('cleared Timeout');
    }

    this.readMessages.push(target.id);
    this.timeout = setTimeout(async () => {
      console.log('in timeout');

      await this.updateMessageState();
    }, 2000);
  }

  async updateMessageState() {
    return this.accountService.readMessagesForPrivateChat(
      this.readMessages,
      this.receiverId
    );
  }
}
