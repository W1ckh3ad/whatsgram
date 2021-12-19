import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { UserService } from '../services/user/user.service';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  showSearch = false;

  constructor(
    private auth: Auth,
    private user: UserService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

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
