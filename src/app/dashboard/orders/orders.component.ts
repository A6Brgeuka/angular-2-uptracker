import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../core/services/pastOrder.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit {
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectAll: boolean;
  public searchKey: string;
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total: number = 6;
  public visible:boolean[] = [];
  private selectAll$:  BehaviorSubject<any> = new BehaviorSubject(false);
  
  constructor(
      public modal: Modal,
      public pastOrderService: PastOrderService
  ) {
  
  
  }

  ngOnInit() {
  
  }
  
  searchFilter(event){
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }

  itemsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
  
  showFiltersModal(){
  }
  
  toggleSelectAll(event) {
    // 0 = unused, 1 = selectAll, 2 = deselectAll
    this.selectAll$.next(event ? 1 : 2);
    this.onCheck();
  }
  
  onCheck() {
  }
  
  chooseTab(a){
    this.setFilter(a);
  }
  
  setFilter(filter:any){
    //TODO
    console.log(`tab ${filter} enabled`)
  }
  changeVisibility(i){
    this.pastOrderService.itemsVisibility[i] = !this.pastOrderService.itemsVisibility[i];
  }
  
  getOrder(id){
    this.pastOrderService.getPastOrder(id)
    .subscribe((res)=>console.log(res));
  }
  
}
