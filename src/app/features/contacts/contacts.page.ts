import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DocumentBase } from '@models/document-base.model';
import { AccountService } from '@services/account/account.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { Observable } from 'rxjs';
import { SearchComponent } from './components/search/search.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  showSearch = false;
  contacts$: Observable<DocumentBase[]>;
  constructor(
    private account: AccountService,
    public modalController: ModalController,
    public db: FirestoreService
  ) {}

  ngOnInit() {
    this.contacts$ = this.account.contacts$;
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'contacts-search',
    });
    return await modal.present();
  }
}
