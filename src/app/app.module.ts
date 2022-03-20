import { NgModule } from '@angular/core';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAuth,
  provideAuth,
  // setPersistence,
  connectAuthEmulator,
} from '@angular/fire/auth';
import {
  getFirestore,
  provideFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
} from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import {
  getStorage,
  provideStorage,
  connectStorageEmulator,
} from '@angular/fire/storage';
import {
  getFunctions,
  provideFunctions,
  connectFunctionsEmulator,
} from '@angular/fire/functions';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NavComponent } from '@components/nav/nav.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      // setPersistence(auth, { type: 'LOCAL' })
      //   .then(() => console.log('Local Persistence working'))
      //   .catch((e) => console.error('Local Persistence not working', e));

      return auth;
    }),
    provideMessaging(() => getMessaging()),
    // provideDatabase(() => getDatabase()),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.emulator) {
        connectFirestoreEmulator(firestore, 'localhost', 8085);
      }
      enableMultiTabIndexedDbPersistence(firestore)
        .then(() => console.log('Multi Tab Storage working'))
        .catch((e) => console.error('Multi Tab Storage isnt working', e));
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (environment.emulator) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.emulator) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      functions.region = 'europe-west3';
      return functions;
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenTrackingService,
    UserTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
