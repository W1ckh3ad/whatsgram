import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account/account.service';
import { PrivateData } from '../services/account/private-data.model';
import { FirestoreService } from '../services/firestore/firestore.service';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  showSearch = false;
  privateData$: Observable<PrivateData>;
  constructor(
    private account: AccountService,
    public modalController: ModalController,
    public db: FirestoreService
  ) {}

  ngOnInit() {
    this.privateData$ = this.account.privateData;
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'contacts-search',
    });
    return await modal.present();
  }
}
