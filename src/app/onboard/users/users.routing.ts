import { UsersComponent } from './users.component';
import {
  UserCollectionResolve,
  DepartmentCollectionResolve,
  PermissionCollectionResolve
} from './users-resolve.service';

export const UsersRoutes = [
  {
    path: 'users',
    component: UsersComponent,
    resolve: {
      userCollection: UserCollectionResolve,
      departmentCollection: DepartmentCollectionResolve,
      permissionCollection: PermissionCollectionResolve
    },
    canActivate: []
  },
];