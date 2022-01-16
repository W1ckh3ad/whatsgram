import { Component, Input, OnInit } from '@angular/core';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() contact: WhatsgramUser = null;
  disable: boolean = false;
  constructor(private account: AccountService) {}

  ngOnInit() {}

  async delete() {
    try {
      this.disable = true;
      await this.account.deleteContact(this.contact.id);
    } catch (error) {
      console.error('Remove user error', this.contact, error);
    }
    this.disable = false;
  }
}
