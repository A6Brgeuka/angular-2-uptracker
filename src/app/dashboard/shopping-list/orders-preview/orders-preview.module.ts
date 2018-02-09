import { NgModule } from '@angular/core';

import { OrdersPreviewComponent } from './orders-preview.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { HttpClient } from '../../../core/services/http.service';

@NgModule({
  declarations: [
    OrdersPreviewComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [
    HttpClient
  ]
})
export class OrdersPreviewModule {
}