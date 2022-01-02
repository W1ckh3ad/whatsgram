import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { getPhotoURL } from 'src/utils';
import { AccountService } from '../services/account/account.service';
import { User } from '../services/account/user.model';
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
  currentUser: Observable<User>;
  contacts: Observable<User>[];
  getPhotoURL = getPhotoURL;
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
      const privateData = this.db.doc$(x.privateData);
      privateData.subscribe((y) => {
        this.contacts = y.contacts.map((x) => this.db.doc$(x));
        this.contacts.map((x) => x.subscribe((y) => console.log(y)));
      });
    });
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'contacts-search',
      swipeToClose: true,
      componentProps: {
        contacts: this.contacts,
      },
    });
    return await modal.present();
  }
}
