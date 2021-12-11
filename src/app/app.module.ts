import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAnalyticsModule,
  APP_NAME,
  APP_VERSION,
  DEBUG_MODE as ANALYTICS_DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
  COLLECTION_ENABLED,
} from '@angular/fire/compat/analytics';
import {
  AngularFireDatabaseModule,
  USE_EMULATOR as USE_DATABASE_EMULATOR,
} from '@angular/fire/compat/database';
import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
  SETTINGS as FIRESTORE_SETTINGS,
} from '@angular/fire/compat/firestore';
import {
  AngularFireStorageModule,
  USE_EMULATOR as USE_STORAGE_EMULATOR,
} from '@angular/fire/compat/storage';
import {
  AngularFireAuthModule,
  USE_DEVICE_LANGUAGE,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
import {
  AngularFireMessagingModule,
  SERVICE_WORKER,
  VAPID_KEY,
} from '@angular/fire/compat/messaging';
import {
  AngularFireFunctionsModule,
  USE_EMULATOR as USE_FUNCTIONS_EMULATOR,
} from '@angular/fire/compat/functions';
import {
  AngularFireRemoteConfigModule,
  SETTINGS as REMOTE_CONFIG_SETTINGS,
  DEFAULTS as REMOTE_CONFIG_DEFAULTS,
} from '@angular/fire/compat/remote-config';
import {
  AngularFirePerformanceModule,
  PerformanceMonitoringService,
} from '@angular/fire/compat/performance';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireRemoteConfigModule,
    AngularFireMessagingModule,
    AngularFireAnalyticsModule,
    AngularFireFunctionsModule,
    AngularFirePerformanceModule,
    // provide modular style for AppCheck, see app.browser/server
    provideFirebaseApp(() => initializeApp(environment.firebase)),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenTrackingService,
    UserTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
