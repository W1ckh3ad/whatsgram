import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { GroupCreate } from '@models/group-create.model';
import { GroupMember } from '@models/group-member';
import { Group } from '@models/group.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { FirestoreService } from '@services/firestore/firestore.service';
import { getGroupDocPath, getGroupMembersCol } from '@utils/db.utils';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private fns: Functions, private dbService: FirestoreService) {}

  async load(groupId?: string) {
    return this.dbService.docSnapWithMetaData<Group>(
      getGroupDocPath(groupId ?? '')
    );
  }

  async loadMembers(groupId?: string) {
    const colSnap = await this.dbService.collection<GroupMember>(
      getGroupMembersCol(groupId ?? '')
    );
    return colSnap.docs;
  }
  loadMembers$(groupId?: string) {
    return this.dbService.collection$<GroupMember>(
      getGroupMembersCol(groupId ?? '')
    );
  }

  async create(model: GroupCreate, creator: WhatsgramUser) {
    try {
      const callable = httpsCallable<
        { model: GroupCreate; creator: WhatsgramUser },
        string
      >(this.fns, 'createGroup');
      return await callable({ model, creator });
    } catch (error) {
      console.error('create group error', error);
      throw error;
    }
  }

  async addMembers(members: WhatsgramUser[], groupId: string) {
    try {
      const callable = httpsCallable<
        { members: WhatsgramUser[]; groupId: string },
        string
      >(this.fns, 'addGroupMember');
      return await callable({ members, groupId });
    } catch (error) {
      console.error('addGroupMember error', error);
      throw error;
    }
  }
}
