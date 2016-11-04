import { UsersComponent } from './users.component';
import {
  DepartmentCollectionResolve,
  RoleCollectionResolve
} from '../../shared/resolves/index';

export const UsersRoutes = [
  {
    path: 'users',
    component: UsersComponent,
    resolve: {
      departmentCollection: DepartmentCollectionResolve,
      permissionCollection: RoleCollectionResolve
    },
    canActivate: []
  },
];