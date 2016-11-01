import { OnboardLocationsComponent } from './locations.component';
import {
    StateCollectionResolve,
    LocationTypesCollectionResolve
} from '../../shared/resolves/index';

export const OnboardLocationsRoutes = [
  {
    path: 'locations',
    component: OnboardLocationsComponent,
    canActivate: [],
    resolve: {
      stateCollection: StateCollectionResolve, 
      locationTypesCollection: LocationTypesCollectionResolve
    }
  },
];