import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';


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
  constructor(
  ) {
  
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

 
}
