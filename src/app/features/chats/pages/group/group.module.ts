import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { AddToGroupComponent } from '../../components/add-to-group/add-to-group.component';
import { EditDescriptionComponent } from '../../components/edit-description/edit-description.component';
import { EditDisplayNameComponent } from '../../components/edit-display-name/edit-display-name.component';
import { GroupPageRoutingModule } from './group-routing.module';
import { GroupPage } from './group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    GroupPage,
    AddToGroupComponent,
    EditDescriptionComponent,
    EditDisplayNameComponent,
  ],
  exports: [SharedModule, FormsModule, IonicModule, CommonModule],
})
export class GroupPageModule {}
