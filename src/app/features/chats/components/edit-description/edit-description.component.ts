import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GroupService } from '@services/group/group.service';

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
})
export class EditDescriptionComponent implements OnInit {
  @Input() groupId: string = null;
  @Input() description: string = null;
  constructor(
    private modalController: ModalController,
    private groupService: GroupService
  ) {}

  ngOnInit() {}

  async dismissModal() {
    await this.modalController.dismiss();
  }

  async onSubmit() {
    await this.groupService.changeDescription(this.groupId, this.description);
    this.dismissModal();
  }
}
