import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';

@Component({
  selector: 'app-contacts-add-search-result',
  templateUrl: './add-search-result.component.html',
  styleUrls: ['./add-search-result.component.scss'],
})
export class AddSearchResultComponent implements OnInit {
  @Input() user: WhatsgramUser;
  @Input() includes = false;
  added = false;
  constructor(
    private accountService: AccountService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async add() {
    if (this.added || this.includes) {
      return;
    }
    this.added = true;
    try {
      return await this.accountService.add(this.user);
    } catch (error) {
      this.added = false;
      this.handleError(error);
    }
  }

  async handleError(e) {
    const toast = await this.toastController.create({
      animated: true,
      message: e.message,
      duration: 2000,
      header: 'Error while adding a contact',
    });

    toast.present();
  }
}
