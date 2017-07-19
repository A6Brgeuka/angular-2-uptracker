import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../shared/shared.module';
import { InventoryItemComponent } from './inventory-item.component';
import { InfoModalModule } from './default-info-modal/info-modal.module';


@NgModule({
  declarations: [
    InventoryItemComponent
  ],
  imports: [
    AppSharedModule,
    InfoModalModule
  ],
  providers: []
})
export class InventoryItemModule {
}