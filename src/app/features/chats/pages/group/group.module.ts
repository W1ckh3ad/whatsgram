import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
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
  declarations: [GroupPage],
  exports: [SharedModule],
})
export class GroupPageModule {}
