import { NgModule } from '@angular/core';

import { MaterializeModule } from 'angular2-materialize';

import { ChipsInputComponent } from './chips.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MaterializeModule,
    CommonModule,
  ],
  exports: [
    ChipsInputComponent,
  ],
  declarations: [
    ChipsInputComponent,
  ],
  providers: [],
})
export class ChipsModule {

}
