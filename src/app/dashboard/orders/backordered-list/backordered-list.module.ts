import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { BackorderedListComponent } from './backordered-list.component';

@NgModule({
  declarations: [
    BackorderedListComponent,
  ],
  exports: [BackorderedListComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class BackorderedListModule {

}