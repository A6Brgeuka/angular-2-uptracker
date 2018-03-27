import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShoppingListFiltersComponent } from './shopping-list-filters.component';
import { ChipsInputModule } from '../../../components/chips-input/chips-input.module';
import { CheckboxesFilterModule } from '../checkboxes-filter/checkboxes-filter.module';
import { DateFilterModule } from '../date-filter/date-filter.module';
import { SingleCheckboxFilterModule } from '../single-checkbox-filter/single-checkbox-filter.module';

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
    ShoppingListFiltersComponent,
  ],
  entryComponents: [
    ShoppingListFiltersComponent,
  ],
  exports: [
    ShoppingListFiltersComponent,
  ]
})
export class ShoppingListFiltersModule {

}
