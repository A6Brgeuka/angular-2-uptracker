import { NgModule } from '@angular/core';

import { AddNewProductComponent } from './add-new-product.component';
import {AppSharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [
    AddNewProductComponent,
  ],
  imports: [
    AppSharedModule
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
