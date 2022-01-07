import { Component, Input, OnInit } from '@angular/core';
import { Account } from 'src/app/services/account/account.model';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input('user') user: Account;
  @Input('includes') includes = false;
  added = false;
  constructor(private account: AccountService) {}

  ngOnInit() {}

  async add() {
    if (this.added || this.includes) {
      return;
    }
    var res = await this.account.add(this.user.uid);
    this.added = true;
    return res;
  }
}
