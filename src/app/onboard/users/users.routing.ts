import { UsersComponent } from './users.component';
import {
  UserCollectionResolve,
  DepartmentCollectionResolve,
  RoleCollectionResolve
} from './users-resolve.service';

export const UsersRoutes = [
  {
    path: 'users',
    component: UsersComponent,
    resolve: {
      userCollection: UserCollectionResolve,
      departmentCollection: DepartmentCollectionResolve,
      permissionCollection: RoleCollectionResolve
    },
    canActivate: []
  },
];