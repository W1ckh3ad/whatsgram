import { Injectable } from '@angular/core';
import {
  deleteToken,
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
  Unsubscribe,
} from '@angular/fire/messaging';
import { AlertController, ToastController } from '@ionic/angular';
import { AccountService } from '@services/account/account.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { getDeviceDocPath } from '@utils/db.utils';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class FirebaseCloudMessagingService {
  currentMessage$ = new BehaviorSubject<MessagePayload>(null);
  sub: Unsubscribe;
  private tokenField = null;
  constructor(
    public messaging: Messaging,
    public db: FirestoreService,
    private account: AccountService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.account.uid$.subscribe(async (x) => {
      x ? await this.getToken() : null;
      console.log('FirebaseCloudMessagingService', x);
      if (x) {
        await this.getToken();
        this.sub = this.receiveMessage();
      }
    });
  }

  ngOnDestroy() {
    this.sub();
  }

  get token() {
    return this.tokenField;
  }

  async getToken() {
    try {
      const token = await getToken(this.messaging, { vapidKey: environment.vapidKey });
      this.tokenField = token;
      if (await this.saveTokenToFirestore(token)) {
        const toast = await this.toastCtrl.create({
          message: 'Successfully registered your device',
          duration: 2000,
        });
        await toast.present();
      }
      return;
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error,
        buttons: ['OK'],
      });
      await alert.present();
      console.error('getToken error', error);
    }
  }

  async deleteToken() {
    try {
      await deleteToken(this.messaging);
      await this.deleteTokenFromFirestore();
      this.tokenField = null;
      const toast = await this.toastCtrl.create({
        message: 'Successfully removed your device from messaging',
        duration: 2000,
      });
      await toast.present();
    } catch (error) {
      console.error('delete token error', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  receiveMessage() {
    return onMessage(this.messaging, async (payload) => {
      await this.displayReceivedMessage(payload);
      console.log('Message Received', payload);
      this.currentMessage$.next(payload);
    });
  }

  private async saveTokenToFirestore(token) {
    if (!token) return false;
    const doc = getDeviceDocPath(this.account.uid$.value, token);
    if (await this.db.exists(doc)) {
      return false;
    }
    const data = {
      token,
      userAgent: navigator.userAgent,
    };
    await this.db.addWithDocumentReference(doc, data);
    return true;
  }

  private async deleteTokenFromFirestore() {
    try {
      if (!this.tokenField) return;
      return await this.db.remove(
        getDeviceDocPath(this.account.uid$.value, this.tokenField)
      );
    } catch (error) {
      return;
    }
  }

  async displayReceivedMessage(payload: MessagePayload) {
    const toast = await this.toastCtrl.create({
      header: payload.notification.title,
      message: payload.notification.body,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
