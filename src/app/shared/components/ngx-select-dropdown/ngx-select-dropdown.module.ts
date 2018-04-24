import { NgModule } from '@angular/core';
import { SelectDropDownComponent } from './ngx-select-dropdown.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    SelectDropDownComponent,
  ],
  exports: [SelectDropDownComponent],
  imports: [AppSharedModule],
  providers: [],
})
export class SelectDropDownModule {}
