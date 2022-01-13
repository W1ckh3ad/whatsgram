import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async onSubmit() {}
  async dismissModal() {
    await this.modalController.dismiss();
  }
}
