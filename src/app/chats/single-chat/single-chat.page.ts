import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/services/account/account.model';
import { AccountService } from 'src/app/services/account/account.service';
import { PrivateData } from 'src/app/services/account/private-data.model';
import { User } from 'src/app/services/account/user.model';
import { Message } from 'src/app/services/chat/message.model';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.page.html',
  styleUrls: ['./single-chat.page.scss'],
})
export class SingleChatPage implements OnInit {
  uid: string;
  responseTo: string = null;
  account: Observable<User>;
  privateData: Observable<PrivateData>;
  messages: Observable<Message>[];
  receiver: Observable<User>;
  privateKey: CryptoKey;

  constructor(
    private activeRoute: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService,
    private db: FirestoreService,
    private crypto: CryptoService
  ) {}

  ngOnInit() {
    this.uid = this.activeRoute.snapshot.paramMap.get('id');
    this.account = this.accountService.load();
    this.account.subscribe((x) => {
      this.privateData = this.db.doc$(x.privateData);
      this.privateData.subscribe((y) => {
        this.crypto.importPrivateKey(y.privateKey).then((x) => {
          this.privateKey = x;
        });
        this.messages = y.chats[this.uid].messages.map((z) => this.db.doc$(z));
      });
    });
    this.receiver = this.userService.load(this.uid);
  }

  onSubmit(msg: string) {
    this.accountService.sendMessage(msg, this.uid, this.responseTo).then(() => {
      console.log('send');
    });
  }

  async decrypt(text: string) {
    return await this.crypto.decryptMessage(text, this.privateKey);
  }
}
