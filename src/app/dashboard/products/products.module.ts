import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { AppSharedModule } from '../../shared/shared.module';
// import { EditVendorModalModule } from './edit-vendor-modal/edit-vendor-modal.module';
import { ViewProductModalModule } from './view-product-modal/view-product-modal.module';

@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    AppSharedModule,
    // EditVendorModalModule,
    ViewProductModalModule
  ],
  providers: []
})
export class ProductsModule {
}