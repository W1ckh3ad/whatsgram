import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';

import { ContactsPage } from './contacts.page';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { DocPipe } from '../pipes/doc/doc.pipe';
import { PhotoUrlPipe } from '../pipes/photo-url/photo-url.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ContactsPageRoutingModule],
  declarations: [
    ContactsPage,
    SearchComponent,
    UserComponent,
    DocPipe,
    PhotoUrlPipe
  ],
})
export class ContactsPageModule {}
