import { OnboardLocationsComponent } from './locations.component';
import {
    StateCollectionResolve,
    LocationTypesCollectionResolve
} from './locations-resolve.service';

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