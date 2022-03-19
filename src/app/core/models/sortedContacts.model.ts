import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';

export type SortedContacts = SortedContactsPart[];
export type SortedContactsPart = {
  startingLetter: string;
  contacts: (WhatsgramUser & DocumentBase)[];
};
