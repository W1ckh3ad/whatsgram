import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '@services/account/account.service';
import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input('user') user: WhatsgramUser & DocumentBase;
  @Input('includes') includes = false;
  added = false;
  constructor(private account: AccountService) {}

  ngOnInit() {}

  async add() {
    if (this.added || this.includes) {
      return;
    }
    this.added = true;
    return await this.account.add(this.user.id);
  }
}
