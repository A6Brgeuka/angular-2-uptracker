import { ProductComponent } from './product.component';
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
    path: 'product/new',
    component: AddProductFromVendorComponent
  }
];
