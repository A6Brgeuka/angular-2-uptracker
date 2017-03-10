import { ProductsComponent } from './products.component';


import { CurrencyCollectionResolve } from '../../shared/resolves/index'
import {
  ProductCollectionResolve,
  ProductAccountingCollectionResolve, ProductCategoriesCollectionResolve, DepartmentCollectionResolve
} from "../../shared/resolves/main-resolve.service";
import { ProductRoutes } from './product/product.routing';

export const ProductsRoutes = [
  {
    path: 'products',
    component: ProductsComponent,
      //{ path: '', redirectTo: "locations", pathMatch: "full" },
    resolve: {
      CurrencyCollectionResolve,
      ProductAccountingCollectionResolve,
      ProductCategoriesCollectionResolve,
      DepartmentCollectionResolve
      // productCollection: ProductCollectionResolve,
    },
    canActivate: []
  },
  ...ProductRoutes,

];