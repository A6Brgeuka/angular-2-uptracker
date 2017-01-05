import { NgModule } from '@angular/core';

import { InventoryComponent } from './inventory.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class InventoryModule {
}