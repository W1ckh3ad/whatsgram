import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocPipe } from '../pipes/doc/doc.pipe';
import { PhotoUrlPipe } from '../pipes/photo-url/photo-url.pipe';
import { DecryptPipe } from '../pipes/decrypt/decrypt.pipe';
import { TimePipe } from '../pipes/time/time.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DocPipe, PhotoUrlPipe, DecryptPipe, TimePipe],
  exports: [DocPipe, PhotoUrlPipe, DecryptPipe, TimePipe],
})
export class ApplicationPipesModule {}
