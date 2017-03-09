import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditProductModalModule } from './edit-product-modal/edit-product-modal.module';
import { ProductFilterModalModule } from './product-filter-modal/product-filter-modal.module';
import { RequestProductModalModule } from './request-product-modal/request-product-modal.module';
import { BulkEditModalModule } from './bulk-edit-modal/bulk-edit-modal.module';
import { ProductModule } from './product/product.module';

@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    AppSharedModule,
    EditProductModalModule,
    ProductFilterModalModule,
    RequestProductModalModule,
    BulkEditModalModule,
    ProductModule
  ],
  providers: []
})
export class ProductsModule {
}