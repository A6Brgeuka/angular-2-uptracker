import { ProductComponent } from './product.component';
import {BrowseGlobalMarketComponent} from "../browse-global-market/browse-global-market.component";
import {AddNewProductComponent} from "../add-new-product/add-new-product.component";
import {AddProductFromVendorComponent} from "../add-product-from-vendor/add-product-from-vendor.component";
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
    component: BrowseGlobalMarketComponent
  },
  {
    path: 'product/global/:id',
    component: AddProductFromVendorComponent
  },
  {
    path: 'product/custom',
    component: AddNewProductComponent
  }
];
