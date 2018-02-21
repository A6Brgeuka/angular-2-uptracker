import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
@DestroySubscribers()
export class AssetsComponent implements OnInit {


  constructor() {
  }

  ngOnInit() {

  }
}
