import {NgModule} from '@angular/core';
import { VariantShortDetailComponent } from './variant-short-detail/variant-short-detail.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { ProductComponent } from './product.component';
import { Add2OrderModalModule } from './add2order-modal/add2order-modal.module';
import { Add2OrderModal } from './add2order-modal/add2order-modal.component';


@NgModule({
    declarations: [
        ProductComponent,
        VariantShortDetailComponent,
        InventoryDetailComponent,
        HistoryDetailComponent,
    ],
    imports: [
        AppSharedModule,
        Add2OrderModalModule
    ],
    providers: []
})
export class ProductModule {
}