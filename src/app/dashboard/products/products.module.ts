import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditProductModalModule } from './edit-product-modal/edit-product-modal.module';
import { ProductFilterModalModule } from './product-filter-modal/product-filter-modal.module';
import { RequestProductModalModule } from './request-product-modal/request-product-modal.module';
import { BulkEditModalModule } from './bulk-edit-modal/bulk-edit-modal.module';
import { ProductModule } from './product/product.module';
import { HomeModule } from './home/home.module';
import { EmbededModule } from './home/page/embeded/embeded.module';
import { UploadCsvModalModule } from './upload-csv-modal/upload-csv-modal.module';

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
    ProductModule,
    EmbededModule,
    UploadCsvModalModule
  ],
  providers: []
})
export class ProductsModule {
}