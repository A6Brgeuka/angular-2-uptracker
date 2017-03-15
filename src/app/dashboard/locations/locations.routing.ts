import { LocationsComponent } from './locations.component';
import {
    StateCollectionResolve,
    LocationTypesCollectionResolve
} from '../../shared/resolves/index';
import { ViewLocatinoRoutes } from './view-location/view-location.routing';

export const LocationsRoutes = [
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [],
    resolve: {
      stateCollection: StateCollectionResolve,
      locationTypesCollection: LocationTypesCollectionResolve
      
    }
  },
  ...ViewLocatinoRoutes
  
];