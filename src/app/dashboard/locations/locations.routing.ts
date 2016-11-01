import { LocationsComponent } from './locations.component';
// import {
//     StateCollectionResolve,
//     LocationTypesCollectionResolve
// } from './locations-resolve.service';

export const LocationsRoutes = [
  {
    path: '',
    component: LocationsComponent,
    canActivate: [],
    // resolve: {
    //   stateCollection: StateCollectionResolve,
    //   locationTypesCollection: LocationTypesCollectionResolve
    // }
  },
];