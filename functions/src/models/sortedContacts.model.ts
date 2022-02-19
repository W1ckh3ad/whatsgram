import {DocumentBase} from "./document-base.model";
import {WhatsgramUser} from "./whatsgram.user.model";

export type SortedContacts = SortedContactsPart[];
export type SortedContactsPart = {
  startingLetter: string;
  contacts: (WhatsgramUser & DocumentBase)[];
};
