import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, AccountService } from '../../../core/services/index';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventorySearchResults, searchData } from '../../../models/inventory.model';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

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
  
  public items$: Observable<any>;
  public items;
  public loadItems$: Subject<any> = new Subject<any>();
  public addItemsToItems$: Subject<any> = new Subject<any>();
  public deleteFromItems$: Subject<any> = new Subject<any>();
  public updateItems$: Subject<any> = new Subject<any>();
  
  
  
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
  
  ngOnInit(){
    
    let addItemsToItems$ = this.addItemsToItems$
    .switchMap((res) => {
      return this.items$.first()
      .map((items: any) => {
        items = items.concat(res);
        return items;
      });
    });
    let deleteFromItems$ = this.deleteFromItems$
    .switchMap((deleteItems) => {
      return this.items$.first()
      .map((items: any) => {
        return items.filter((el: any) => {
          return el.variant_id != deleteItems.variant_id;
        });
      });
    });
    this.items$ = Observable.merge(
      this.loadItems$,
      addItemsToItems$,
      deleteFromItems$
    ).publishReplay(1).refCount();
    this.items$.subscribe(res => {
      this.items = res;
    });
    this.loadItems$.next([]);
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
  
  addToInventory(items:InventorySearchResults[]){
    // reset selection
    items.map((item: InventorySearchResults) => {
      item.checked=false;
      return item;
    });
    this.addItemsToItems$.next(_.cloneDeep(items));
  }
  deleteFromInventory(items:InventorySearchResults[]){
    items.map((i)=>this.deleteFromItems$.next(i));
  }
  bulkAdd(){
    this.searchResults$
    .take(1)
    .subscribe((items:InventorySearchResults[])=>{
      // get checked
      let checkedItems = items.filter((item:InventorySearchResults)=>item.checked);
      this.addToInventory(checkedItems);
    });
  }
  bulkDelete(){
    // get checked
    let checkedItems = this.items.filter((item:InventorySearchResults)=>item.checked);
    this.deleteFromInventory(checkedItems);
  }
}
