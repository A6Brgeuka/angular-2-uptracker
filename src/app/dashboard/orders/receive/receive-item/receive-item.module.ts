import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../../shared/shared.module';

import { ReceiveItemComponent } from './receive-item.component';
import { ReceiveStatusLineItemModule } from './receive-status-line-item/receive-status-line-item.module';
import { ReceiveNewStatusItemModule } from './receive-new-status-item/receive-new-status-item.module';

@NgModule({
  declarations: [ReceiveItemComponent],
  exports: [ReceiveItemComponent],
  imports: [
    AppSharedModule,
    ReceiveStatusLineItemModule,
    ReceiveNewStatusItemModule,
  ],
  providers: []
})
export class ReceiveItemModule {

}
