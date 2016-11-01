import { OnboardLocationsComponent } from './locations.component';
import {
    StateCollectionResolve,
    LocationTypesCollectionResolve,
    LocationCollectionResolve
} from '../../shared/resolves/index';

export const OnboardLocationsRoutes = [
  {
    path: 'locations',
    component: OnboardLocationsComponent,
    canActivate: [],
    resolve: {
      stateCollection: StateCollectionResolve, 
      locationTypesCollection: LocationTypesCollectionResolve,
      locationCollection: LocationCollectionResolve
    }
  },
];