import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { ApplicationPipesModule } from '../application-pipes/application-pipes.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SettingsPageRoutingModule, ApplicationPipesModule],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
