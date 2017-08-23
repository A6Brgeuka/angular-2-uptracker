import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { InventoryService } from '../../../core/services/inventory.service';


@Component({
  selector: 'app-order-detail',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
@DestroySubscribers()
export class ReceiveComponent implements OnInit, AfterViewInit {

  public total:number = 10;
  public searchKey:string= "";
  public mockItems:number[] = [0,0,0,0,0,0];
  public locationArr: any = [];
  public inventoryGroupArr: any = [];
  public tempArr: any = [];
  public orders$ = this.pastOrderService.ordersToReceive$;
  
  constructor(
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public router: Router,
    public pastOrderService: PastOrderService
  ) {
    this.accountService.locations$
    .subscribe(r => this.locationArr = r );

    this.inventoryService.collection$.subscribe(r => this.inventoryGroupArr = r);
  }
  
  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  remove(item){
    this.mockItems.pop();
  }
 
  save(){
  
  }
  
  addProduct(){
      this.router.navigate(['/products']);
  }
  
}
