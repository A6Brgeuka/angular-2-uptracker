import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {DropdownPackageComponent} from "./dropdown-package.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Angular2FontawesomeModule
  ],
  declarations: [
    DropdownPackageComponent
  ],
  exports: [
    DropdownPackageComponent
  ]
})
export class DropdownPackageModule { }
