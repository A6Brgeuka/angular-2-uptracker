import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { MaterializeModule } from "angular2-materialize";
import { FileDropModule } from 'angular2-file-drop';

import { CoreModule } from "../core/core.module";

import { IterablePipe } from "./pipes/iterable/iterable.pipe";
import * as directives from "./directives";
import MaskedInput from 'angular2-text-mask';

let directivesArr = [
  // directives.IntlPhoneMaskDirective,

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
    MaterializeModule,
    FileDropModule
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
    FileDropModule,
    
    ...directivesArr,
    ...pipesArr
  ],
  providers: []
})
export class AppSharedModule {
}