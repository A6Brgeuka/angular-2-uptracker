import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiltersModalComponent } from './filters-modal.component';
import { ChipsInputModule } from '../../components/chips-input/chips-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ChipsInputModule,
    FormsModule,
    ReactiveFormsModule,
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
