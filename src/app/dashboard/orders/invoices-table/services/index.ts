import { AllInvoicesListService } from './all-invoices-list.service';
import { InvoicesTableService } from './invoices-table.service';
import { OpenInvoicesListService } from './open-invoices-list.service';

export const INVOICES_PROVIDERS = [
  AllInvoicesListService,
  InvoicesTableService,
  OpenInvoicesListService,
];
