import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { MaterializeModule } from "angular2-materialize";
import { FileDropModule } from 'angular2-file-drop';

// import { CoreModule } from "../core/core.module";

import { IterablePipe } from "./pipes/iterable/iterable.pipe";
import * as directives from "./index";
import { TextMaskModule } from 'angular2-text-mask';

let directivesArr = [
  directives.IntlPhoneMaskDirective,
  directives.UserDropdownMenuDirective
];


let pipesArr = [
  IterablePipe,
];

// resolvers
import {
  MAIN_RESOLVER_PROVIDERS,
  ACCOUNT_RESOLVER_PROVIDERS
} from './resolves/index';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpModule,

    // CoreModule,
    MaterializeModule,
    FileDropModule,
    TextMaskModule
  ],
  declarations: [
    ...directivesArr,
    ...pipesArr
  ],
  exports: [
    RouterModule,
    // BrowserModule,
    FormsModule,
    // HttpModule,
    CommonModule,
    // CoreModule,
    
    MaterializeModule,
    FileDropModule,
    TextMaskModule,
    
    ...directivesArr,
    ...pipesArr
  ],
  providers: [
    ...MAIN_RESOLVER_PROVIDERS,
    ...ACCOUNT_RESOLVER_PROVIDERS
  ]
})
export class AppSharedModule {
}