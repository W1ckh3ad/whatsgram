import {
  chats,
  contacts,
  devices,
  groups,
  members,
  messages,
  users,
} from "../constants/collection-names";

/**
 * Getting users collection path.
 * @return {string} The users collection path.
 */
export function getUsersColPath(): string {
  return users;
}

/**
 * Getting user doc path with id.
 * @param {string} id The user id.
 * @return {string} The users doc path.
 */
export function getUserDocPath(id: string): string {
  return `${getUsersColPath()}/${id}`;
}

/**
 * Getting user contacts collection path.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getContactsColPath(id: string): string {
  return `${getUserDocPath(id)}/${contacts}`;
}

/**
 * Getting users collection path.
 * @param {string} userId The user id.
 * @param {string} id The contact id.
 * @return {string} The users collection path.
 */
export function getContactDocPath(userId: string, id: string): string {
  return `${getContactsColPath(userId)}/${id}`;
}

/**
 * Getting users collection path.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getDevicesColPath(id: string): string {
  return `${getUserDocPath(id)}/${devices}`;
}

/**
 * Getting users collection path.
 * @param {string} id The user id.
 * @param {string} token The user id.
 * @return {string} The users collection path.
 */
export function getDeviceDocPath(id: string, token: string): string {
  return `${getDevicesColPath(id)}/${token}`;
}

/**
 * Getting users collection path.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getChatsColPath(id: string): string {
  return `${getUserDocPath(id)}/${chats}`;
}

/**
 * Getting users collection path.
 * @param {string} userId The user id.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getChatDocPath(userId: string, id: string): string {
  return `${getChatsColPath(userId)}/${id}`;
}

/**
 * Getting users collection path.
 * @param {string} userId The user id.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getMessageColPath(userId: string, id: string): string {
  return `${getChatDocPath(userId, id)}/${messages}`;
}

/**
 * Getting users collection path.
 * @param {string} userId The user id.
 * @param {string} groupdOrChatId The user id.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getMessageDocPath(
    userId: string,
    groupdOrChatId: string,
    id: string
): string {
  return `${getMessageColPath(userId, groupdOrChatId)}(${id})`;
}

/**
 * Getting users collection path.
 * @return {string} The users collection path.
 */
export function getGroupsColPath(): string {
  return groups;
}

/**
 * Getting users collection path.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getGroupDocPath(id: string): string {
  return `${getGroupsColPath()}/${id}`;
}

/**
 * Getting users collection path.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getGroupMembersCol(id: string): string {
  return `${getGroupDocPath(id)}/${members}`;
}
/**
 * Getting users collection path.
 * @param {string} groupId The user id.
 * @param {string} id The user id.
 * @return {string} The users collection path.
 */
export function getGroupMemberDoc(groupId: string, id: string): string {
  return `${getGroupMembersCol(groupId)}/${id}`;
}
