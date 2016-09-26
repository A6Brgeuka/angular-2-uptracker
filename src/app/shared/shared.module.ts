import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { MaterializeModule } from "angular2-materialize";

import { CoreModule } from "../core/core.module";

import { IterablePipe } from "./pipes/iterable/iterable.pipe";
// import * as directives from "./directives";
// import * as lodash from "lodash";
import MaskedInput from 'angular2-text-mask';

let directivesArr = [
  // PageScroll,
  // directives.SvgIconComponent,
  // directives.LogoutDirective,
  // directives.CalculatorTableComponent,
  // directives.GetStartedComponent,
  //
  // directives.AlertsRangeSliderComponent,
  // directives.Ng2SliderComponent,
  // derectives to ng2 slider
  // SlideAbleDirective, Ng2StyledDirective,

  MaskedInput
];


let pipesArr = [
  IterablePipe,
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    CoreModule,
    MaterializeModule
  ],
  declarations: [
    ...directivesArr,
    ...pipesArr
  ],
  exports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    CoreModule,
    
    MaterializeModule,
    
    ...directivesArr,
    ...pipesArr
  ],
  providers: []
})
export class AppSharedModule {
}