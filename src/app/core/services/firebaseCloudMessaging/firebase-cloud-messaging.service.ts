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
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { decryptMessage, importPrivateKey } from '@utils/crypto.utils';
import { getDeviceDocPath } from '@utils/db.utils';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@capacitor/storage';
@Injectable({
  providedIn: 'root',
})
export class FirebaseCloudMessagingService {
  currentMessage$ = new BehaviorSubject<MessagePayload>(null);
  sub: Unsubscribe;
  private tokenField: string = null;
  constructor(
    public messaging: Messaging,
    public dbService: FirestoreService,
    public cryptoKeysService: CryptoKeysService,
    private accountService: AccountService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.accountService.uid$.subscribe(async (x) => {
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

  async getToken(isMainDevice: boolean = false) {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey,
      });
      this.tokenField = token;
      if (await this.saveTokenToFirestore(token, isMainDevice)) {
        const toast = await this.toastController.create({
          message: 'Successfully registered your device',
          duration: 2000,
        });
        await toast.present();
      }
      return;
    } catch (error) {
      const alert = await this.alertController.create({
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
      const toast = await this.toastController.create({
        message: 'Successfully removed your device from messaging',
        duration: 2000,
      });
      await toast.present();
    } catch (error) {
      console.error('delete token error', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: error,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  receiveMessage() {
    return onMessage(this.messaging, async (payload) => {
      console.log(payload);
      if (payload.data.type === 'privateKey') {
        console.log('received private key');
        const key = await Storage.get({ key: 'receiveKey' });
        if (!key.value) throw new Error('No key in storage');
        const promises = [];
        const groups = payload.data.key.split('|');
        const privateKey = await importPrivateKey(key.value);
        groups.forEach((x) => promises.push(decryptMessage(x, privateKey)));
        const keys = await Promise.all(promises);
        this.cryptoKeysService.receivePrivateKey(atob(keys.join('')));
      }
      await this.displayReceivedMessage(payload);
      console.log('Message Received', payload);
      this.currentMessage$.next(payload);
    });
  }

  private async saveTokenToFirestore(
    token: string,
    isMainDevice: boolean = false
  ) {
    if (!token) return false;
    const doc = getDeviceDocPath(this.accountService.uid$.value, token);
    if (await this.dbService.exists(doc)) {
      return false;
    }
    const data = {
      token,
      userAgent: navigator.userAgent,
      isMainDevice,
    };
    await this.dbService.addWithDocumentReference(doc, data);
    return true;
  }

  private async deleteTokenFromFirestore() {
    try {
      if (!this.tokenField) return;
      return await this.dbService.remove(
        getDeviceDocPath(this.accountService.uid$.value, this.tokenField)
      );
    } catch (error) {
      return;
    }
  }

  async displayReceivedMessage(payload: MessagePayload) {
    const message =
      payload.data.type === 'chatMessage'
        ? await decryptMessage(
            payload.notification.body,
            await this.cryptoKeysService.getPrivateKey()
          )
        : payload.notification.body;
    const toast = await this.toastController.create({
      header: payload.notification.title,
      icon: payload.notification.image,
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
