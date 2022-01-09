import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';

import { ContactsPage } from './contacts.page';
import { SearchComponent } from './components/search/search.component';
import { UserComponent } from './components/user/user.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactsPageRoutingModule,
    SharedModule,
  ],
  exports: [IonicModule, SharedModule],
  declarations: [ContactsPage, SearchComponent, UserComponent],
})
export class ContactsPageModule {}
