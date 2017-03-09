import { ProductComponent } from './product.component';
export const ProductRoutes = [
  {
    path: 'product',
    component: ProductComponent,
    resolve: {
      // productCollection: ProductCollectionResolve,
    },
    canActivate: []
  },
];