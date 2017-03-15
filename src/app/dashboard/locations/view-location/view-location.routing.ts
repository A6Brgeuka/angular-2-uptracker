import { ViewLocationComponent } from './view-location.component';
export const ViewLocatinoRoutes = [
  {
    path: 'locations/view/:id',
    component: ViewLocationComponent,
    resolve: {
    },
    canActivate: []
  },
];