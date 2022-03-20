import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import { SharedModule } from '@shared/shared.module';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { SwiperModule } from 'swiper/angular';
import { AddToGroupComponent } from './components/add-to-group/add-to-group.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    SwiperModule,
  ],
  exports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule,
    SwiperModule,
  ],
  declarations: [ChatsPage, CreateGroupComponent, AddToGroupComponent],
})
export class ChatsPageModule {}
