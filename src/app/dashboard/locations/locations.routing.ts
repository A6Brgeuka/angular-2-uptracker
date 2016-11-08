import { LocationsComponent } from './locations.component';
import {
    StateCollectionResolve,
    LocationTypesCollectionResolve
} from '../../shared/resolves/index';

export const LocationsRoutes = [
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [],
    resolve: {
      stateCollection: StateCollectionResolve,
      locationTypesCollection: LocationTypesCollectionResolve
    }
  }
];