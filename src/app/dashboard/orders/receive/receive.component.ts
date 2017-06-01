import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';


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
  public locationArr: any;
  constructor(
    public accountService: AccountService,
    public router:Router,
  ) {
    this.accountService.locations$
    .subscribe(r=>{this.locationArr = r});
  
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
