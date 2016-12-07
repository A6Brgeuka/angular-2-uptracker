import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditProductModalModule } from './edit-product-modal/edit-product-modal.module';
import { ViewProductModalModule } from './view-product-modal/view-product-modal.module';
import { ProductFilterModalModule } from './product-filter-modal/product-filter-modal.module';
import { RequestProductModalModule } from './request-product-modal/request-product-modal.module';

@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    AppSharedModule,
    EditProductModalModule,
    ViewProductModalModule,
    ProductFilterModalModule,
    RequestProductModalModule
  ],
  providers: []
})
export class ProductsModule {
}