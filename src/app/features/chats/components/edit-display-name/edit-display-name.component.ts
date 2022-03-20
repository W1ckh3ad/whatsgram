import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GroupService } from '@services/group/group.service';

@Component({
  selector: 'app-edit-display-name',
  templateUrl: './edit-display-name.component.html',
  styleUrls: ['./edit-display-name.component.scss'],
})
export class EditDisplayNameComponent implements OnInit {
  @Input() groupId: string = null;
  @Input() displayName: string = null;
  constructor(
    private modalController: ModalController,
    private groupService: GroupService
  ) {}

  ngOnInit() {}

  async dismissModal() {
    await this.modalController.dismiss();
  }

  async onSubmit() {
    await this.groupService.changeDisplayName(this.groupId, this.displayName);
    this.dismissModal();
  }
}
