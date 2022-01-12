import { Component, Input, OnInit } from '@angular/core';
import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';

@Component({
  selector: 'app-contacts-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input() user: WhatsgramUser & DocumentBase;
  @Input() includes = false;
  added = false;
  constructor(private account: AccountService) {}

  ngOnInit() {}

  async add() {
    if (this.added || this.includes) {
      return;
    }
    this.added = true;
    try {
      return await this.account.add(this.user.id);
    } catch (error) {
      this.added = false;
      console.error(error);
    }
  }
}
