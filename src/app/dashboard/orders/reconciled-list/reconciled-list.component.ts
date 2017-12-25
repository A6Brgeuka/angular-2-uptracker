import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-reconciled-list',
  templateUrl: './reconciled-list.component.html',
  styleUrls: ['./reconciled-list.component.scss']
})
@DestroySubscribers()
export class ReconciledListComponent implements OnInit, OnDestroy {
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
