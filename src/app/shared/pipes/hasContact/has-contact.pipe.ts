import { Pipe, PipeTransform } from '@angular/core';
import { AccountService } from '@services/account/account.service';

@Pipe({
  name: 'hasContact',
})
export class HasContactPipe implements PipeTransform {
  constructor(private account: AccountService) {}
  transform(userId: string): Promise<boolean> {
    return this.account.hasContact(userId);
  }
}
