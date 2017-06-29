import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../shared/shared.module';
import { InventoryItemComponent } from './inventory-item.component';


@NgModule({
  declarations: [
    InventoryItemComponent
  ],
  imports: [
    AppSharedModule,
  ],
  providers: []
})
export class InventoryItemModule {
}