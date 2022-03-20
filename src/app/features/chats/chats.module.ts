import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { ChatsPageRoutingModule } from './chats-routing.module';
import { ChatsPage } from './chats.page';
import { CreateGroupComponent } from './components/create-group/create-group.component';




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
  declarations: [ChatsPage, CreateGroupComponent],
})
export class ChatsPageModule {}
