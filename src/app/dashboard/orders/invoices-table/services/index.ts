import { ApprovalInvoicesListService } from './approval-invoices-list.service';
import { AllInvoicesListService } from './all-invoices-list.service';
import { InvoicesTableService } from './invoices-table.service';
import { OpenInvoicesListService } from './open-invoices-list.service';
import { PaymentInvoicesListService } from './payment-invoices-list.service';
import { PaidInvoicesListService } from './paid-invoices-list.service';

export const INVOICES_PROVIDERS = [
  ApprovalInvoicesListService,
  AllInvoicesListService,
  InvoicesTableService,
  OpenInvoicesListService,
  PaymentInvoicesListService,
  PaidInvoicesListService,
];
