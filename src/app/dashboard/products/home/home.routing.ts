import { HomeComponent } from './home.component';
import { pageRoutes } from './page/page.routing';


export const homeRoutes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      ...pageRoutes
    ]
  },
  
];

//export const homeRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);