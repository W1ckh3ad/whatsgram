import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { UserService } from '@services/user/user.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-contacts-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  users$: Observable<WhatsgramUser[]>;
  search = '';
  contacts$: Observable<string[]>;

  constructor(
    public modalController: ModalController,
    private user: UserService
  ) {}

  async ngOnInit() {}

  async onSubmit() {
    this.users$ = this.user.find(this.search).pipe(tap((x) => console.log(x)));
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
