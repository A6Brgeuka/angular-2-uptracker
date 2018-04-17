import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditProductModalModule } from './edit-product-modal/edit-product-modal.module';
import { ProductFilterModalModule } from './product-filter-modal/product-filter-modal.module';
import { RequestProductModalModule } from './request-product-modal/request-product-modal.module';
import { BulkEditModalModule } from './bulk-edit-modal/bulk-edit-modal.module';
import { ProductModule } from './product/product.module';
import { UploadCsvModalModule } from './upload-csv-modal/upload-csv-modal.module';
import { HomeTabModule } from './home-tab/home-tab.module';
import { MarisListTabModule } from './maris-list-tab/maris-list-tab.module';
import { MarketplaceTabModule } from './marketplace-tab/marketplace-tab.module';
import { SearchFilterHeaderModule } from '../../shared/components/search-filter-header/search-filter-header.module';
import { BrowseGlobalMarketModule } from './browse-global-market/browse-global-market.module';
import { AddNewProductModule } from './add-new-product/add-new-product.module';
import { AddProductFromVendorModule } from './add-product-from-vendor/add-product-from-vendor.module';
import { MarketplaceFiltersModule } from '../../shared/modals/filters-modal/marketplace-filters/marketplace-filters.module';
import {ProductVariantModule} from "../../shared/components/product-variant/product-variant.module";

@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    AppSharedModule,
    EditProductModalModule,
    HomeTabModule,
    ProductFilterModalModule,
    RequestProductModalModule,
    SearchFilterHeaderModule,
    BulkEditModalModule,
    ProductModule,
    MarisListTabModule,
    MarketplaceTabModule,
    MarketplaceFiltersModule,
    UploadCsvModalModule,
    BrowseGlobalMarketModule,
    AddNewProductModule,
    AddProductFromVendorModule,
    ProductVariantModule
  ],
  providers: []
})
export class ProductsModule {
}
