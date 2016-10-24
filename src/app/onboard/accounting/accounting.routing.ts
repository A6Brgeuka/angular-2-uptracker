import { AccountingComponent } from './accounting.component';
// import {
//     StateCollectionResolve,
//     LocationTypesCollectionResolve
// } from './locations-resolve.service';

export const AccountingRoutes = [
  {
    path: 'accounting',
    component: AccountingComponent,
    canActivate: []
  }
];