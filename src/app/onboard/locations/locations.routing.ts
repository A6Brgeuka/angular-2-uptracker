import { LocationsComponent } from './locations.component';
import { StateCollectionResolve } from './locations-resolve.service';

export const LocationsRoutes = [
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [],
    resolve: {
      stateCollection: StateCollectionResolve
    }
  },
];