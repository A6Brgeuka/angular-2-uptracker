import { ProductComponent } from './product.component';
import {AddProductFromVendorStep1Component} from '../add-product-from-vendor/add-product-from-vendor-step1.component';
import {AddProductFromVendorStep2Component} from '../add-product-from-vendor/add-product-from-vendor-step2.component';
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
    path: 'product/new/step1',
    component: AddProductFromVendorStep1Component
  },
  {
    path: 'product/new/step2',
    component: AddProductFromVendorStep2Component
  }
];
