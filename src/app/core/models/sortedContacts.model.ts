import { DocumentBase } from '../../../../shared/models/document-base.model';
import { WhatsgramUser } from 'shared/models/whatsgram.user.model';

export type SortedContacts = SortedContactsPart[];
export type SortedContactsPart = {
  startingLetter: string;
  contacts: (WhatsgramUser & DocumentBase)[];
};
