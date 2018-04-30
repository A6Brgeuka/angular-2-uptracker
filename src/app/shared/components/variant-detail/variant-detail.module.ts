import {NgModule} from '@angular/core';

import {VariantDetailComponent} from "./variant-detail.component";
import {CommonModule} from "@angular/common";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    VariantDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    Angular2FontawesomeModule
  ],
  exports: [
    VariantDetailComponent
  ],
  providers: [],
})
export class VariantDetailModule {
}
