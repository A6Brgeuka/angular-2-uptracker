import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared.module';
import { AddCustomProductModule } from '../../../components/add-custom-product.module';
import { AddNewProductModalComponent } from './add-new-product-modal.component';
import { ViewProductModalModule } from '../../../../dashboard/products/view-product-modal/view-product-modal.module';

@NgModule({
  declarations: [
    AddNewProductModalComponent,
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
  entryComponents: [AddNewProductModalComponent]
})
export class AddNewProductModalModule {

}
