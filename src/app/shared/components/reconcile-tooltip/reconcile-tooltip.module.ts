import { NgModule } from '@angular/core';
import { ReconcileTooltipComponent } from './reconcile-tooltip.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    ReconcileTooltipComponent,
  ],
  exports: [ReconcileTooltipComponent],
  imports: [AppSharedModule],
  providers: [],
})
export class ReconcileTooltipModule {}
