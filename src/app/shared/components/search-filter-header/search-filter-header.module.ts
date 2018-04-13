import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Angular2FontawesomeModule } from 'angular2-fontawesome';

import { SearchFilterHeaderComponent } from './search-filter-header.component';
import { ChipsInputModule } from '../chips-input/chips-input.module';
import { ChipsModule } from '../chips/chips.module';
import { MaterializeModule } from 'angular2-materialize';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    SearchFilterHeaderComponent,
  ],
  exports: [SearchFilterHeaderComponent],
  imports: [
    AppSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Angular2FontawesomeModule,
    ChipsInputModule,
    ChipsModule,
    MaterializeModule,
  ],
  providers: [],
})
export class SearchFilterHeaderModule {

}
