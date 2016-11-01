import { AccountingComponent } from './accounting.component';
import {
    CurrencyCollectionResolve
} from '../../shared/resolves/index';

export const AccountingRoutes = [
  {
    path: 'accounting',
    component: AccountingComponent,
    resolve: {
      currencyCollection: CurrencyCollectionResolve
    }
  }
];