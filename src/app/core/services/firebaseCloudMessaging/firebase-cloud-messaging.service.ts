import { Injectable } from '@angular/core';
import {
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
  Unsubscribe,
  deleteToken,
} from '@angular/fire/messaging';
import { AlertController, ToastController } from '@ionic/angular';
import { AccountService } from '@services/account/account.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { BehaviorSubject } from 'rxjs';

const publicKey =
  'BOCxxACIR2YIAHgVrTQucnE5hISyzHJnHs26UfeJiugaJn4SGQi0itGpk4mKSXDDm1I_HkWnEEDWXOv0nc0rDVc';
@Injectable({
  providedIn: 'root',
})
export class FirebaseCloudMessagingService {
  currentMessage$ = new BehaviorSubject<MessagePayload>(null);
  sub: Unsubscribe;
  private token = null;
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

  async getToken() {
    try {
      const token = await getToken(this.messaging, { vapidKey: publicKey });
      this.token = token;
      await this.saveTokenToFirestore(token);
      const toast = await this.toastCtrl.create({
        message: 'Successfully registered your device',
        duration: 2000,
      });
      await toast.present();
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
      this.token = null;
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

  private saveTokenToFirestore(token) {
    if (!token) return;
    const data = {
      token,
      userId: this.account.uid$.value,
    };

    return this.db.addWithDocumentReference(`devices/${token}`, data);
  }

  private deleteTokenFromFirestore() {
    if (!this.token) return;
    return this.db.remove(`devices/${this.token}`);
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
