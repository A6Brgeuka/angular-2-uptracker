import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DepartmentFilterComponent } from './department-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DepartmentFilterComponent,
  ],
  exports: [
    DepartmentFilterComponent,
  ]
})
export class DepartmentFilterModule {

}
