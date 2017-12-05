import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';

@Component({
  selector: 'received-list',
  templateUrl: './received-list.component.html',
  styleUrls: ['./received-list.component.scss']
})
@DestroySubscribers()
export class ReceivedListComponent implements OnInit{

  constructor(
    public pastOrderService: PastOrderService,
  ) {

  }
  
  ngOnInit() {
    this.pastOrderService.getReceivedProducts()
    .subscribe(res => {console.log(res); return res})
  }
  
}
