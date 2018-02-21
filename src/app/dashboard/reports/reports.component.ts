import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
@DestroySubscribers()
export class ReportsComponent implements OnInit {

  
  constructor() {
  }
  
  ngOnInit() {
  
  }
}
