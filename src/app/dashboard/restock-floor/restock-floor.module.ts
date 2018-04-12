import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared/shared.module';
import { RestockFloorComponent } from './restock-floor.component';

@NgModule({
  declarations: [
    RestockFloorComponent
  ],
  exports: [
    RestockFloorComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})

export class RestockFloorModule {
}
