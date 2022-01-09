import { Injectable } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { AccountService } from '@services/account/account.service';
import { FirestoreService } from '@services/firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseCloudMessagingService {
  constructor(
    public messaging: Messaging,
    public db: FirestoreService,
    private account: AccountService
  ) {}

  async getToken() {
    const token = await getToken(this.messaging);
    return this.saveTokenToFirestore(token);
  }

  addNotificationListener() {
    return null; // onMessage(this.messaging)
  }

  private saveTokenToFirestore(token) {
    if (!token) return;
    const devicesRef = this.db.getDevicesCol();
    const data = {
      token,
      userId: this.account.uid$.value,
    };

    return this.db.set(`devices/${token}`, data);
  }
}
