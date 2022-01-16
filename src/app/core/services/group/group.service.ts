import { Injectable } from '@angular/core';
import { GroupCreate } from 'shared/models/group-create.model';
import { WhatsgramUser } from 'shared/models/whatsgram.user.model';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private fns: Functions) {}

  async create(model: GroupCreate, creator: WhatsgramUser) {
    try {
      const callable = httpsCallable(this.fns, 'createGroup');
      return await callable({ model, creator });
    } catch (error) {
      console.error('create group error', error);
      throw error;
    }
  }
}
