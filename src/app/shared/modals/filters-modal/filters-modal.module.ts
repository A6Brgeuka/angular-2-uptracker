import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiltersModalComponent } from './filters-modal.component';
import { VendorFilterModule } from './vendor-filter/vendor-filter.module';
import { DepartmentFilterModule } from './department-filter/department-filter.module';
import { CategoryFilterModule } from './category-filter/category-filter.module';
import { AccountingFilterModule } from './accounting-filter/accounting-filter.module';
import { MyFavoritesFilterModule } from './my-favorites-filter/my-favorites-filter.module';

@NgModule({
  imports: [
    CommonModule,
    AccountingFilterModule,
    CategoryFilterModule,
    DepartmentFilterModule,
    VendorFilterModule,
    MyFavoritesFilterModule,
  ],
  declarations: [
    FiltersModalComponent,
  ],
  entryComponents: [
    FiltersModalComponent,
  ],
  exports: [
    FiltersModalComponent,
  ]
})
export class FiltersModalModule {

}
