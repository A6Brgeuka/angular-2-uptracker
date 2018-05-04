import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterializeModule } from "angular2-materialize";
import { FileDropModule } from 'angular2-file-drop';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { SelectModule } from 'ng-select';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DatepickerModule } from 'angular2-material-datepicker';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from "angular2-google-maps/core";

import { IterablePipe } from "./pipes/iterable/iterable.pipe";
import { InputValueSearch } from "./pipes/input-value-search/input-value-search.pipe";
import { CapitalizeFirstPipe } from "./pipes/capitilizeFirst/capitilizeFirst";
import {CurrencyUsdPipe} from "./pipes/currency-usd/currency-usd.pipe";
import {TextFilterPipe} from "./pipes/text-filter/text-filter.pipe";
import * as directives from "./index";
import { GooglePlacesInputModule, HasClassModule } from "./directives";
import { VendorSearchComponent } from "./components/vendor-search/vendor-search.component";
// import { SelectDropDownModule } from './components/ngx-select-dropdown/ngx-select-dropdown.module';

let directivesArr = [
  directives.IntlPhoneMaskDirective,
  directives.UserDropdownMenuDirective
];

let pipesArr = [
  IterablePipe,
  InputValueSearch,
  CapitalizeFirstPipe,
  CurrencyUsdPipe,
  TextFilterPipe
];

let componentsArr = [
  VendorSearchComponent
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
import { UniConfirmModal } from './modals/uni-confirm-modal/uni-confirm-modal.component';
import { APP_DI_CONFIG } from '../../../env';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AddVendorModalComponent } from './modals/add-vendor-modal/add-vendor-modal.component';
import { ChipsInputModule } from './components/chips-input/chips-input.module';
import { ChipsModule } from './components/chips/chips.module';
import {ScannerModule} from "../dashboard/scanner/scanner.module";
import {PriceInputModule} from "./components/price-input/price-input.module";
import {VariantDetailModule} from "./components/variant-detail/variant-detail.module";
import {UploadEditFileModule} from "./components/upload-edit-file/upload-edit-file.module";
import {UploadEditImageModalModule} from "./modals/upload-edit-image-modal/upload-edit-image-modal.module";

const modalsArr = [
  EditUserModal,
  EditLocationModal,
  ChangePasswordUserModal,
  EditCommentModal,
  UniConfirmModal,
  AddVendorModalComponent
];

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  //suppressScrollX: true
};

@NgModule({
  imports: [
    BootstrapModalModule,
    ModalModule,

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
    GooglePlacesInputModule,
    NguiAutoCompleteModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    SelectModule,
    Daterangepicker,
    NgxDatatableModule,
    CurrencyMaskModule,
    PriceInputModule,
    ScannerModule,
    VariantDetailModule,
    // SelectDropDownModule,

    DatepickerModule,
    UploadEditFileModule,
    UploadEditImageModalModule
  ],
  declarations: [
    ...directivesArr,
    ...pipesArr,
    ...modalsArr,
    ...componentsArr
  ],
  exports: [
    BootstrapModalModule,
    ModalModule,

    RouterModule,

    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    Daterangepicker,
    NgxDatatableModule,
    CurrencyMaskModule,
    // SelectDropDownModule,

    MaterializeModule,
    FileDropModule,
    TextMaskModule,
    Angular2FontawesomeModule,
    GooglePlacesInputModule,
    NguiAutoCompleteModule,
    PerfectScrollbarModule,

    HasClassModule,
    ChipsInputModule,
    ChipsModule,
    PriceInputModule,
    ScannerModule,
    VariantDetailModule,

    DatepickerModule,
    UploadEditFileModule,
    UploadEditImageModalModule,

    ...directivesArr,
    ...pipesArr,
    ...modalsArr,
    ...componentsArr
  ],
  providers: [
    ...MAIN_RESOLVER_PROVIDERS,
    ...ACCOUNT_RESOLVER_PROVIDERS,
    CurrencyUsdPipe
  ],
  entryComponents: [
    ...modalsArr
  ]
})
export class AppSharedModule {
}
