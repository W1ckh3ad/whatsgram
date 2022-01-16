import { DocumentBase } from 'shared/models/document-base.model';
import { SortedContactsPart } from '@models/sortedContacts.model';
import { WhatsgramUser } from 'shared/models/whatsgram.user.model';

export const sortContactsIntoLetterSegments = (
  contacts: (WhatsgramUser & DocumentBase)[]
) => {
  if (contacts.length === 0) {
    return [] as SortedContactsPart[];
  }
  let result: SortedContactsPart[] = [];
  let subResult: SortedContactsPart = null;
  for (let index = 0; index < contacts.length; index++) {
    const element = contacts[index];
    const startingLetter = element.displayName.substring(0, 1).toUpperCase();
    if (!subResult || startingLetter !== subResult.startingLetter) {
      if (subResult) {
        result.push(subResult);
      }
      subResult = {
        startingLetter,
        contacts: [],
      };
    }
    subResult.contacts.push(element);
  }
  result.push(subResult);
  return result;
};
