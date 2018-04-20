import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared.module';
import { AddCustomProductComponent } from './add-custom-product.component';

@NgModule({
  declarations: [
    AddCustomProductComponent
  ],
  exports: [
    AddCustomProductComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
})
export class AddCustomProductModule {

}
