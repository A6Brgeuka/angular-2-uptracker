import { EditVendorComponent } from './edit-vendor.component';
export const EditVendorRoutes = [
  {
    path: 'vendors/edit/:id',
    component: EditVendorComponent,
    resolve: {
    },
    canActivate: []
  },
  {
    path: 'vendors/add',
    component: EditVendorComponent,
    resolve: {
    },
    canActivate: []
  },
];