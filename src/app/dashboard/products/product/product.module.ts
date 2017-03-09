import {NgModule} from '@angular/core';
import { VariantDetailComponent } from '../view-product-modal/variant-detail/variant-detail.component';
import { InventoryDetailComponent } from '../view-product-modal/inventory-detail/inventory-detail.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { HistoryDetailComponent } from '../view-product-modal/history-detail/history-detail.component';
import { ProductComponent } from './product.component';


@NgModule({
    declarations: [
        ProductComponent,
        VariantDetailComponent,
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