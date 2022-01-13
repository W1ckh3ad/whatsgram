import { Injectable } from '@angular/core';
import {
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
  Unsubscribe,
} from '@angular/fire/messaging';
import { ToastController } from '@ionic/angular';
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
  constructor(
    public messaging: Messaging,
    public db: FirestoreService,
    private account: AccountService,
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
      return this.saveTokenToFirestore(token);
    } catch (error) {
      console.error('getToken error', error);
    }
  }

  receiveMessage() {
    return onMessage(this.messaging, async (payload) => {
      debugger;
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
