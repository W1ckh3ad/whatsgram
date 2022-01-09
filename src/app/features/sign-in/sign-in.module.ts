import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignInPage } from './sign-in.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SignInPage],
})
export class SignInPageModule {}
