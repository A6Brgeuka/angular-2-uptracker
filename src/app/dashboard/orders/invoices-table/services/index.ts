import { AllInvoicesListService } from './all-invoices-list.service';
import { InvoicesTableService } from './invoices-table.service';

export const INVOICES_PROVIDERS = [
  AllInvoicesListService,
  InvoicesTableService,
];
