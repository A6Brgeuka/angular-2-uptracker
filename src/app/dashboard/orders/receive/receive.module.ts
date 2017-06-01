import { NgModule } from '@angular/core';

import { ReceiveComponent } from './receive.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ReceiveComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class ReceiveModule {
}