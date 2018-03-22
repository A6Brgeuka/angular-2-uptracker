import { NgModule } from '@angular/core';

import { StockComponent } from './stock.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    StockComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class StockModule {}
