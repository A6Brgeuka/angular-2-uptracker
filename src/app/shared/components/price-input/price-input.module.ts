import { NgModule } from '@angular/core';
import {PriceInputComponent} from "./price-input.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OnlyNumbersModule} from "../../directives/only-numbers/only-numbers.module";

@NgModule({
  declarations: [
    PriceInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OnlyNumbersModule
  ],
  exports: [
    PriceInputComponent
  ],
  providers: [],
})
export class PriceInputModule {

}
