import { ViewVendorComponent } from './view-vendor.component';
export const ViewVendorRoutes = [
  {
    path: 'vendors/view/:id',
    component: ViewVendorComponent,
    resolve: {
    },
    canActivate: []
  },
];