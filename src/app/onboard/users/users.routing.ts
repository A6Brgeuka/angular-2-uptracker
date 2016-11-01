import { OnboardUsersComponent } from './users.component';
import {
  UserCollectionResolve,
  DepartmentCollectionResolve,
  RoleCollectionResolve
} from '../../shared/resolves/index';

export const OnboardUsersRoutes = [
  {
    path: 'users',
    component: OnboardUsersComponent,
    resolve: {
      userCollection: UserCollectionResolve,
      departmentCollection: DepartmentCollectionResolve,
      permissionCollection: RoleCollectionResolve
    },
    canActivate: []
  },
];