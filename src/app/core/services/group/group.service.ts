import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { GroupCreate } from '@models/group-create.model';
import { GroupMember } from '@models/group-member';
import { Group } from '@models/group.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { FirestoreService } from '@services/firestore/firestore.service';
import {
  getGroupDocPath,
  getGroupMemberDoc,
  getGroupMembersCol,
} from '@utils/db.utils';

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

  toggleAdmin(isAdmin: boolean, groupId: string, memberId: string) {
    this.dbService.setUpdate(
      getGroupMemberDoc(groupId, memberId),
      { isAdmin: !isAdmin },
      { merge: true }
    );
  }

  removeMember(groupId: string, memberId: string) {
    this.dbService.remove(getGroupMemberDoc(groupId, memberId));
  }

  async removeGroup(groupId: string) {
    try {
      const callable = httpsCallable<{ groupId: string }, string>(
        this.fns,
        'removeGroup',
        {}
      );
      return await callable({ groupId });
    } catch (error) {
      console.error('removeGroup error', error);
      throw error;
    }
  }

  async changeDisplayName(groupId: string, displayName: string) {
    return this.dbService.setUpdate(
      getGroupDocPath(groupId),
      { displayName },
      { merge: true }
    );
  }

  async changeDescription(groupId: string, description?: string) {
    return this.dbService.setUpdate(
      getGroupDocPath(groupId),
      { description: description ?? null },
      { merge: true }
    );
  }

  async changePhotoURL(groupId: string, photoURL?: string) {
    return this.dbService.setUpdate(
      getGroupDocPath(groupId),
      { photoURL: photoURL ?? null },
      { merge: true }
    );
  }
}
