import {NgModule} from '@angular/core';

import {ViewProductModal} from './view-product-modal.component';
import {AppSharedModule} from '../../../shared/shared.module';
import {InventoryDetailComponent} from './inventory-detail/inventory-detail.component';
import {HistoryDetailComponent} from "./history-detail/history-detail.component";
import {VariantDetailModule} from "../../../shared/components/variant-detail/variant-detail.module";

@NgModule({
    declarations: [
        ViewProductModal,
        VariantDetailModule,
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
    entryComponents: [ViewProductModal]
})
export class ViewProductModalModule {
}
