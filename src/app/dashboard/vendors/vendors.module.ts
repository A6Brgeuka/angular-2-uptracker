import { NgModule } from '@angular/core';

import { VendorsComponent } from './vendors.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    VendorsComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class VendorsModule {
}