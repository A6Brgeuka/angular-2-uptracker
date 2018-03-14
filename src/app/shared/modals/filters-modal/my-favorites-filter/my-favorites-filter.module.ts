import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyFavoritesFilterComponent } from './my-favorites-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    MyFavoritesFilterComponent,
  ],
  exports: [
    MyFavoritesFilterComponent,
  ]
})
export class MyFavoritesFilterModule {

}
