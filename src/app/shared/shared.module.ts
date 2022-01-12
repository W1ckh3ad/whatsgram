import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocPipe } from './pipes/doc/doc.pipe';
import { PhotoUrlPipe } from './pipes/photo-url/photo-url.pipe';
import { DecryptPipe } from './pipes/decrypt/decrypt.pipe';
import { TimePipe } from './pipes/time/time.pipe';
import { ObserveVisibilityDirective } from './directives/observeVisibility/observe-visibility.directive';
import { HasContactPipe } from './pipes/hasContact/has-contact.pipe';
import { UserPipe } from './pipes/user/user.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DocPipe,
    PhotoUrlPipe,
    DecryptPipe,
    TimePipe,
    ObserveVisibilityDirective,
    HasContactPipe,
    UserPipe,
  ],
  exports: [
    DocPipe,
    PhotoUrlPipe,
    DecryptPipe,
    TimePipe,
    ObserveVisibilityDirective,
    HasContactPipe,
    UserPipe,
  ],
})
export class SharedModule {}
