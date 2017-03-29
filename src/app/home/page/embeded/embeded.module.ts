import { NgModule } from '@angular/core';
import { EmbededComponent } from './embeded.component';
import { CustomModal } from './custom-modal';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    EmbededComponent,
    CustomModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  entryComponents: [ CustomModal ]
})
export class EmbededModule { }
