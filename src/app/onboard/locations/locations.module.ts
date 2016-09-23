import { NgModule } from '@angular/core';

import { LocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    LocationsComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class LocationsModule {
}