import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReconcileComponent } from './reconcile.component';
import { ReconcileProductModalModule } from '../reconcile-product-modal/reconcile-product-modal.module';
import {
    SelectDropDownModule
} from '../../../shared/components/ngx-select-dropdown/ngx-select-dropdown.module';

@NgModule({
  declarations: [
    ReconcileComponent,
  ],
  imports: [
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReconcileProductModalModule,
    SelectDropDownModule
  ],
  providers: []
})
export class ReconcileModule {}
