import { NgModule } from '@angular/core';

import { AddNewProductComponent } from './add-new-product.component';
import {ViewProductModalModule} from '../view-product-modal/view-product-modal.module';
import {AppSharedModule} from '../../../shared/shared.module';
import {AddCustomProductModule} from '../../../shared/components/add-custom-product.module';

@NgModule({
  declarations: [
    AddNewProductComponent,
  ],
  imports: [
    ViewProductModalModule,
    AppSharedModule,
    AddCustomProductModule,
  ],
  providers: [],
  exports: [
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [AddNewProductComponent]
})
export class AddNewProductModule {

}
