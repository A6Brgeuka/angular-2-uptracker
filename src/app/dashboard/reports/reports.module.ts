import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared/shared.module';
import { ReportsComponent } from './reports.component';
import { SearchFilterModule } from '../../shared/components/search-filter/search-filter.module';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    AppSharedModule,
    SearchFilterModule
  ],
  providers: []
})
export class ReportsModule {
}