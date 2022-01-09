import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPage } from './forgot-password.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ForgotPasswordPage],
})
export class ForgotPasswordPageModule {}
