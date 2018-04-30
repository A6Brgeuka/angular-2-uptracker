import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {OnlyNumbersDirective} from "./only-numbers.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OnlyNumbersDirective,
  ],
  exports: [
    OnlyNumbersDirective,
  ],
})
export class OnlyNumbersModule {
}
