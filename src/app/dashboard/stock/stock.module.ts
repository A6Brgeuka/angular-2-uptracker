import { NgModule } from '@angular/core';

import { StockComponent } from './stock.component';
import { AppSharedModule } from '../../shared/shared.module';
import { UpdateStockModalModule } from './update-stock-modal/update-stock-modal.module';

@NgModule({
  declarations: [
    StockComponent
  ],
  imports: [
    AppSharedModule,
    UpdateStockModalModule
  ],
  providers: []
})
export class StockModule {}
