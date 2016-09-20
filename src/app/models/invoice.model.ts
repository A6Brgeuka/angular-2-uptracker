import { UserModel, DeploymentInvoiceModel, PaymentModel } from './'

export class InvoiceModel {
  id: number;
  startDate:string;
  endDate:string;
  createdAt:string;
  updatedAt:string;
  
  idUser: UserModel
  user: UserModel;
  
  idPayment: number;
  payment: PaymentModel;
  
  deploymentInvoices: DeploymentInvoiceModel[]
  

  constructor(obj?: any) {
    this.id                   = obj && obj.id                        || null;
    this.startDate            = obj && obj.startDate                 || null;
    this.endDate              = obj && obj.endDate                   || null;
    this.createdAt            = obj && obj.createdAt                 || null;
    this.updatedAt            = obj && obj.updatedAt                 || null;
    
    this.idUser               = obj && obj.idUser                    || null;
    this.user                 = obj && obj.user                      || null;
    
    this.idPayment            = obj && obj.idPayment                 || null;
    this.payment              = obj && obj.payment                   || null;
    
    this.deploymentInvoices   = obj && obj.deploymentInvoices        || [];
  }
}