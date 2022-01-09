import { Injectable } from '@angular/core';
import {
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
} from '@angular/fire/messaging';
import { ToastController } from '@ionic/angular';
import { AccountService } from '@services/account/account.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseCloudMessagingService {
  currentMessage = new BehaviorSubject<MessagePayload>(null);
  constructor(
    public messaging: Messaging,
    public db: FirestoreService,
    private account: AccountService,
    private toastCtrl: ToastController
  ) {
    this.account.uid$.subscribe(async (x) =>
      x ? await this.getToken() : null
    );
  }

  async getToken() {
    const token = await getToken(this.messaging);
    return this.saveTokenToFirestore(token);
  }

  receiveMessage() {
    onMessage(this.messaging, async (payload) => {
      await this.displayReceivedMessage(payload);
      console.log('Message Received', payload);
      this.currentMessage.next(payload);
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
