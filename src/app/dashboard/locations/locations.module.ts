import { NgModule } from '@angular/core';

import { LocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';

import { EditLocationModalModule } from '../../shared/modals/index';

@NgModule({
  declarations: [
    LocationsComponent,
  ],
  imports: [
    AppSharedModule,
    EditLocationModalModule
  ],
  providers: []
})
export class LocationsModule {
}