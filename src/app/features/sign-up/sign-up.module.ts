import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPage } from './sign-up.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SignUpPage],
})
export class SignUpPageModule {}
