import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-closed-list',
  templateUrl: './closed-list.component.html',
  styleUrls: ['./closed-list.component.scss']
})
@DestroySubscribers()
export class ClosedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  constructor(
  
  ) {

  }
  
  ngOnInit() {

  }
  
  addSubscribers() {
    
  }
  
  ngOnDestroy() {
  
  }
  
}
