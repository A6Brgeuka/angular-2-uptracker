import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-backordered-list',
  templateUrl: './backordered-list.component.html',
  styleUrls: ['./backordered-list.component.scss']
})
@DestroySubscribers()
export class BackorderedListComponent implements OnInit, OnDestroy {
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
