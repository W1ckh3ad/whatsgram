import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignOutPage } from './sign-out.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SignOutPage],
})
export class SignOutPageModule {}
