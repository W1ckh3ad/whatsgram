import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';

import { ContactsPage } from './contacts.page';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ContactsPageRoutingModule],
  declarations: [ContactsPage, SearchComponent],
})
export class ContactsPageModule {}
