import { NgModule } from '@angular/core';

import { ViewProductModal } from './view-product-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { VariantDetailComponent } from "./variant-detail/variant-detail.component";

@NgModule({
  declarations: [
    ViewProductModal,
    VariantDetailComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ViewProductModal ]
})
export class ViewProductModalModule {
}