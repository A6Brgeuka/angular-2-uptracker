import { PageComponent } from './page.component';
import { embededRoutes } from './embeded/embeded.routing';


export const pageRoutes = [
  {
    path: 'page',
    component: PageComponent,
    children: [
      ...embededRoutes
    ]
  },
];

//export const homeRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);