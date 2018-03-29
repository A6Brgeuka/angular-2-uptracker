import { NgModule } from '@angular/core';

import { StockComponent } from './stock.component';
import { AppSharedModule } from '../../shared/shared.module';
import { UpdateStockModalModule } from './update-stock-modal/update-stock-modal.module';
import { SortProductsPipe } from './stock.pipe';

@NgModule({
  declarations: [
    StockComponent,
    SortProductsPipe
  ],
  imports: [
    AppSharedModule,
    UpdateStockModalModule
  ],
  providers: []
})
export class StockModule {}
