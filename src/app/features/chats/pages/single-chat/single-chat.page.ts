import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentBase } from '@models/document-base.model';
import { Message } from '@models/message.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
// import { AccountService } from '@services/account/account.service';
import { ChatService } from '@services/chat/chat.service';
import { UserService } from '@services/user/user.service';
import { DocumentReference } from 'firebase/firestore';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.page.html',
  styleUrls: ['./single-chat.page.scss'],
})
export class SingleChatPage implements OnInit {
  receiverId: string;
  receiverId$: Observable<string> = null;
  responseTo: string = null;
  message$: Observable<(Message & DocumentBase)[]>;
  unreadMessageRefs$: Observable<DocumentReference<Message>[]>;
  receiver$: Observable<WhatsgramUser>;
  readMessage: { createdAt: number; id: string } = null;
  timeout: any;

  constructor(
    private activeRoute: ActivatedRoute,
    // private account: AccountService,
    private chat: ChatService,
    private user: UserService
  ) {}

  async ngOnInit() {
    this.receiverId = this.activeRoute.snapshot.paramMap.get('id');
    this.receiverId$ = this.activeRoute.paramMap.pipe(map((x) => x.get('id')));
    this.message$ = this.activeRoute.paramMap.pipe(
      switchMap((x) => this.chat.loadMessages(x.get('id')))
    );
    this.receiver$ = this.activeRoute.paramMap.pipe(
      switchMap((x) => this.user.load(x.get('id')))
    );
  }

  onVisible(target) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      console.log('cleared Timeout');
    }

    // this.readMessages.push(target.id);
    this.timeout = setTimeout(async () => {
      console.log('in timeout');

      // await this.updateMessageState();
    }, 2000);
  }

  // async updateMessageState() {
  //   return this.account.readMessagesForPrivateChat(
  //     this.readMessage.id,
  //     this.receiverId
  //   );
  // }
}
