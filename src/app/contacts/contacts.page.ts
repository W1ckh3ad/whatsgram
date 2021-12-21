import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { Account } from '../services/account/account.model';
import { AccountService } from '../services/account/account.service';
import { UserService } from '../services/user/user.service';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  showSearch = false;
  currentUser: Account;
  contacts = [];
  constructor(
    private auth: Auth,
    private account: AccountService,
    private user: UserService,
    public modalController: ModalController
  ) {}

  async ngOnInit() {
    this.currentUser = await this.account.load();
    this.contacts = [];
    (await this.user.loadList(this.currentUser.privateData.contacts)).forEach(
      (x) => this.contacts.push(x.data())
    );
    console.log(this.contacts);
  }

  search() {}

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'contacts-search',
      swipeToClose: true,
    });
    return await modal.present();
  }

  get() {}
}
