import { UsersComponent } from './users.component';
import {
    UserCollectionResolve    
} from './users-resolve.service';

export const UsersRoutes = [
  {
    path: 'users',
    component: UsersComponent,
    resolve: {
      userCollection: UserCollectionResolve
    },
    canActivate: []
  },
];