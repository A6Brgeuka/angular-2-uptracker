import { NgModule } from '@angular/core';

import { OrdersPreviewComponent } from './orders-preview.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { HttpClient } from '../../../core/services/http.service';
import { EditFaxDataModalModule } from './edit-fax-data-modal/edit-fax-data-modal.module';

@NgModule({
  declarations: [
    OrdersPreviewComponent,
  ],
  imports: [
    AppSharedModule,
    EditFaxDataModalModule
  ],
  providers: [
    HttpClient
  ]
})
export class OrdersPreviewModule {
}