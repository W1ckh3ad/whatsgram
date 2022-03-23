import {
  chats,
  contacts,
  devices,
  groups,
  members,
  messages,
  users,
} from '../constants/collection-names';

export function getUsersColPath() {
  return users;
}

export function getUserDocPath(id: string) {
  return `${getUsersColPath()}/${id}`;
}
export function getContactsColPath(id: string) {
  return `${getUserDocPath(id)}/${contacts}`;
}

export function getContactDocPath(userId: string, id: string) {
  return `${getContactsColPath(userId)}/${id}`;
}

export function getDevicesColPath(id: string) {
  return `${getUserDocPath(id)}/${devices}`;
}

export function getDeviceDocPath(id: string, token: string) {
  return `${getDevicesColPath(id)}/${token}`;
}

export function getChatsColPath(id: string) {
  return `${getUserDocPath(id)}/${chats}`;
}

export function getChatDocPath(userId: string, id: string) {
  return `${getChatsColPath(userId)}/${id}`;
}

export function getMessageColPath(userId: string, id: string) {
  return `${getChatDocPath(userId, id)}/${messages}`;
}

export function getMessageDocPath(
  userId: string,
  groupdOrChatId: string,
  id: string
) {
  return `${getMessageColPath(userId, groupdOrChatId)}(${id})`;
}

export function getGroupsColPath() {
  return groups;
}

export function getGroupDocPath(id: string) {
  return `${getGroupsColPath()}/${id}`;
}

export function getGroupMembersCol(id: string) {
  return `${getGroupDocPath(id)}/${members}`;
}
export function getGroupMemberDoc(groupId: string, id: string) {
  return `${getGroupMembersCol(groupId)}/${id}`;
}
