import { ProductComponent } from './product.component';
import {BrowseGlobalMarketModalComponent} from "../../../shared/modals/add-market-product-modal/browse-global-market-modal/browse-global-market-modal.component";
import {AddNewProductModalComponent} from "../../../shared/modals/add-market-product-modal/add-new-product-modal/add-new-product-modal.component";
export const ProductRoutes = [
  {
    path: 'products/:id',
    component: ProductComponent,
    resolve: {
      // productCollection: ProductCollectionResolve,
    },
    canActivate: []
  },
  {
    path: 'product/global',
    component: BrowseGlobalMarketModalComponent
  },
  {
    path: 'product/custom',
    component: AddNewProductModalComponent
  }
];
