import { NgModule } from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditProductModalModule } from './edit-product-modal/edit-product-modal.module';
import { ViewProductModalModule } from './view-product-modal/view-product-modal.module';
import { ProductFilterModalModule } from './product-filter-modal/product-filter-modal.module';
import { RequestProductModalModule } from './request-product-modal/request-product-modal.module';
import { AddProductModalModule } from "./add-product-modal/add-product-modal.module";

@NgModule({
  declarations: [
    ShoppingListComponent,
  ],
  imports: [
    AppSharedModule,
    AddProductModalModule,
    EditProductModalModule,
    ViewProductModalModule,
    ProductFilterModalModule,
    RequestProductModalModule
  ],
  providers: []
})
export class ShoppingListModule {
}