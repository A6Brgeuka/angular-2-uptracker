import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipsInputModule } from '../../../components/chips-input/chips-input.module';
import { CheckboxesFilterModule } from '../checkboxes-filter/checkboxes-filter.module';
import { DateFilterModule } from '../date-filter/date-filter.module';
import { SingleCheckboxFilterModule } from '../single-checkbox-filter/single-checkbox-filter.module';
import { InventoryGroupFiltersComponent } from './inventory-group-filters.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChipsInputModule,
    CheckboxesFilterModule,
    DateFilterModule,
    SingleCheckboxFilterModule,
  ],
  declarations: [
    InventoryGroupFiltersComponent,
  ],
  exports: [
    InventoryGroupFiltersComponent,
  ]
})
export class InventoryGroupFiltersModule {

}
