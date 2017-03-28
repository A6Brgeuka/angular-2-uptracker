import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterializeModule } from "angular2-materialize";
import { FileDropModule } from 'angular2-file-drop';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

// import { CoreModule } from "../core/core.module";

import { IterablePipe } from "./pipes/iterable/iterable.pipe";
import * as directives from "./index";
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from "angular2-google-maps/core";
import { APP_DI_CONFIG } from "../app.config";
import { GooglePlacesInputModule } from "./directives";

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

// modals
import { EditUserModal } from './modals/edit-user-modal/edit-user-modal.component';
import { EditLocationModal } from './modals/edit-location-modal/edit-location-modal.component';
import { ChangePasswordUserModal } from "./modals/change-password-user-modal/change-password-user-modal.component";
import { EditCommentModal } from "./modals/edit-comment-modal/edit-comment-modal.component";
//import { Add2OrderModal } from './modals/add2order-modal/add2order-modal.component';
//import { AddToOrderModal } from './modals/add-to-order-modal/add-to-order-modal.component';

let modalsArr = [
  EditUserModal,
  EditLocationModal,
  ChangePasswordUserModal,
  EditCommentModal,
  //Add2OrderModal
  //AddToOrderModal
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MaterializeModule,
    FileDropModule,
    TextMaskModule,
    Angular2FontawesomeModule,
    AgmCoreModule.forRoot({
      apiKey: APP_DI_CONFIG.googlePlaces.apiKey,
      libraries: ["places"]
    }),
    GooglePlacesInputModule
  ],
  declarations: [
    ...directivesArr,
    ...pipesArr,
    ...modalsArr
  ],
  exports: [
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    MaterializeModule,
    FileDropModule,
    TextMaskModule,
    Angular2FontawesomeModule,
    GooglePlacesInputModule,

    ...directivesArr,
    ...pipesArr
  ],
  providers: [
    ...MAIN_RESOLVER_PROVIDERS,
    ...ACCOUNT_RESOLVER_PROVIDERS
  ],
  entryComponents: [
    ...modalsArr
  ]
})
export class AppSharedModule {
}