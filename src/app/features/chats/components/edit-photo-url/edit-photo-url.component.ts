import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GroupService } from '@services/group/group.service';

@Component({
  selector: 'app-edit-photo-url',
  templateUrl: './edit-photo-url.component.html',
  styleUrls: ['./edit-photo-url.component.scss'],
})
export class EditPhotoUrlComponent implements OnInit {

  @Input() groupId: string = null;
  @Input() photoURL: string = null;
  constructor(
    private modalController: ModalController,
    private groupService: GroupService
  ) {}

  ngOnInit() {}

  async dismissModal() {
    await this.modalController.dismiss();
  }

  async onSubmit() {
    await this.groupService.changePhotoURL(this.groupId, this.photoURL);
    this.dismissModal();
  }

}
