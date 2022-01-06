import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentReference } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
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
  uid: string;
  uid$: Observable<string>;
  responseTo: string = null;
  messageRefs$: Observable<DocumentReference<Message>[]>;
  unreadMessageRefs$: Observable<DocumentReference<Message>[]>;
  receiver$: Observable<WhatsgramUser>;

  constructor(
    private activeRoute: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.uid = this.activeRoute.snapshot.paramMap.get('id');
    this.uid$ = this.activeRoute.paramMap.pipe(switchMap((x) => x.get('id')));
    this.messageRefs$ = this.accountService.privateData.pipe(
      map((x) => (x.chats[this.uid] ? x.chats[this.uid].messages : []))
    );
    this.messageRefs$.subscribe((x) => console.log(x));
    this.unreadMessageRefs$ = this.accountService.inbox.pipe(
      map((x) => (x.chats[this.uid] ? x.chats[this.uid].messages : []))
    );

    this.receiver$ = this.userService.load(this.uid);
  }

  onSubmit(msg: string) {
    this.accountService.sendMessage(msg, this.uid, this.responseTo).then(() => {
      console.log('send');
    });
  }
}
