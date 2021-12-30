import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/services/account/account.model';
import { AccountService } from 'src/app/services/account/account.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.page.html',
  styleUrls: ['./single-chat.page.scss'],
})
export class SingleChatPage implements OnInit {
  uid: string;
  responseTo: string = null;
  account: Observable<Account>;
  receiver: Observable<Account>;

  constructor(
    private activeRoute: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService
  ) {
    console.log(this.accountService);
  }

  ngOnInit() {
    this.uid = this.activeRoute.snapshot.paramMap.get('id');
    this.account = this.accountService.load();
    this.receiver = this.userService.load(this.uid);
    console.log(this.accountService);
  }

  onSubmit(msg: string) {
    debugger;
    console.log(this);
    this.accountService.sendMessage(msg, this.uid, this.responseTo).then(() => {
      debugger;
      console.log('send');
    });
  }
}
