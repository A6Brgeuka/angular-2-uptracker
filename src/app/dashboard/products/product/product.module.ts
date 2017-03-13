import {NgModule} from '@angular/core';
import { VariantShortDetailComponent } from './variant-short-detail/variant-short-detail.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { ProductComponent } from './product.component';


@NgModule({
    declarations: [
        ProductComponent,
        VariantShortDetailComponent,
        InventoryDetailComponent,
        HistoryDetailComponent
    ],
    imports: [
        AppSharedModule
    ],
    providers: [],
    // IMPORTANT:
    // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [ProductComponent]
})
export class ProductModule {
}