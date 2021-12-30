import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Account } from '../services/account/account.model';
import { AccountService } from '../services/account/account.service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { UserService } from '../services/user/user.service';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  showSearch = false;
  currentUser: Observable<Account>;
  contacts: Observable<Account>[];
  constructor(
    private account: AccountService,
    private user: UserService,
    public modalController: ModalController,
    public db: FirestoreService
  ) {}

  ngOnInit() {
    this.currentUser = this.account.load();
    this.currentUser.subscribe((x) => {
      console.log('UPDATE', x);
      this.contacts = x.privateData.contacts.map((x) => this.db.doc$(x));
      this.contacts.map((x) => x.subscribe((y) => console.log(y)));
    });
  }

  search() {}

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'contacts-search',
      swipeToClose: true,
      componentProps: {
        currentUser: this.currentUser,
      },
    });
    return await modal.present();
  }

  get() {}
}
