import { NgModule } from '@angular/core';

import { InventoryComponent } from './inventory.component';
import { AppSharedModule } from '../../shared/shared.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';

@NgModule({
  declarations: [
    InventoryComponent,
  ],
  imports: [
    AppSharedModule,
    InventoryItemModule
  ],
  providers: []
})
export class InventoryModule {
}