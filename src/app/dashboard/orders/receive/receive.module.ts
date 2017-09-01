import { NgModule } from '@angular/core';

import { ReceiveComponent } from './receive.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ReceiveComponent,
  ],
  imports: [
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class ReceiveModule {
}