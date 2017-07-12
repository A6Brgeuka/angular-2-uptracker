import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, AccountService } from '../../../core/services/index';
import { InventoryService } from '../../../core/services/inventory.service';
import { searchData } from '../../../models/inventory.model';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class AddInventoryModalContext extends BSModalContext {
}

@Component({
  selector: 'app-add-inventory-modal',
  templateUrl: './add-inventory-modal.component.html',
  styleUrls: ['./add-inventory-modal.component.scss']
})
@DestroySubscribers()
export class AddInventoryModal implements OnInit, CloseGuard, ModalComponent<AddInventoryModalContext> {public subscribers: any = {};
  context: AddInventoryModalContext;
  total:number = 0;
  public typeIn$: any = new Subject();
  searchResults$: any = new BehaviorSubject([]);
  addedItems$: any = new BehaviorSubject([]);
  
  constructor(
      public dialog: DialogRef<AddInventoryModalContext>,
      public userService: UserService,
      public accountService: AccountService,
      public inventoryService: InventoryService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    
    this.typeIn$
    .debounceTime(1000)
    .switchMap((key:string)=>this.inventoryService.search(key))
    .subscribe((data:searchData)=>{
      this.total = data.count;
      this.searchResults$.next(data.results);
    });
  }
  
  onSearchTypeIn(event){
    this.typeIn$.next(event.target.value);
  }
  
  onSearchInput(event){
  
  }

  ngOnInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
}
