import { NgModule } from '@angular/core';
import {InventorySearchModalComponent} from "./inventory-search-modal.component";
import {AppSharedModule} from "../../../shared/shared.module";
import {InventoryModule} from "../inventory.module";

@NgModule({
  declarations: [
    InventorySearchModalComponent,
  ],
  imports: [
    AppSharedModule,
    InventoryModule
  ],
  providers: [],
  entryComponents: [ InventorySearchModalComponent ]
})
export class InventorySearchModalModule { }
