import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { OrderItemStatusFormGroup } from '../../models/order-item-status-form.model';
import { ReceivedOrderService } from '../../../../../core/services/received-order.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
  ReceivedInventoryGroupLocationModel,
  ReceivedInventoryGroupModel
} from '../../models/received-inventory-group.model';
import { ReceiveService } from '../../receive.service';
import { Subject } from 'rxjs/Subject';

import * as _ from 'lodash';

@Component({
  selector: 'app-receive-new-status-item',
  templateUrl: './receive-new-status-item.component.html',
})
@DestroySubscribers()

export class ReceiveNewStatusItemComponent implements OnInit {

  public statusList: any = this.receivedOrderService.statusList;

  public inventoryGroup$: Observable<ReceivedInventoryGroupModel>;
  public inventoryGroups$: Observable<ReceivedInventoryGroupModel[]>;
  public isSelectDisabled$: Observable<boolean>;
  public locations$: Observable<any[]>;

  selectedInventoryGroupSubject$: Subject<ReceivedInventoryGroupModel> = new Subject();
  selectedInventoryGroup$: Observable<ReceivedInventoryGroupModel>;

  selectedLocation$: Observable<any>;
  selectedLocationSubject$: Subject<any> = new Subject();

  @Input() public statusFormGroup: OrderItemStatusFormGroup;

  @Input() public inventoryGroupIdControl: FormControl;
  @Input() public inventoryGroupIds: string[] = [];

  @Output() remove = new EventEmitter();

  constructor(
    public receivedOrderService: ReceivedOrderService,
    private receiveService: ReceiveService,
  ) {

  }

  get typeControl() {
    return this.statusFormGroup.get('type');
  }

  get qtyControl() {
    return this.statusFormGroup.get('qty');
  }

  get locationIdControl() {
    return this.statusFormGroup.get('location_id');
  }

  get storageLocationIdControl() {
    return this.statusFormGroup.get('storage_location_id');
  }

  ngOnInit() {
    const inventoryGroupId = this.inventoryGroupIdControl.value
    this.inventoryGroup$ = this.receiveService.getInventoryGroup(inventoryGroupId);
    this.inventoryGroups$ = inventoryGroupId ?
      this.inventoryGroup$.map((group) => [group]) :
      this.receiveService.getInventoryGroups(this.inventoryGroupIds);
    this.isSelectDisabled$ = this.inventoryGroup$
    .map((inventoryGroup) => !!inventoryGroup);

    this.selectedInventoryGroup$ = Observable.merge(
      this.inventoryGroup$,
      this.selectedInventoryGroupSubject$,
    );

    this.locations$ = this.selectedInventoryGroup$
    .map((inventoryGroup) => (inventoryGroup && inventoryGroup.locations) || [])
    .map((locations) =>
      locations.reduce((acc, location) => {
        const combinedLocations = location.storage_locations
        .map((storageLocation) => ({
          label: `${location.name}: ${storageLocation.name}`,
          storage_location_id: storageLocation.id,
          location_id: location.id
        }));
        return [...acc, ...combinedLocations];
      }, [])
    );

    const selectedLocation$ = this.locations$
    .map((locations) =>
      locations.find(({location_id, storage_location_id }: any) => {
        return location_id === this.locationIdControl.value && storage_location_id === this.storageLocationIdControl.value;
      })
    );

    this.selectedLocation$ = Observable.merge(
      selectedLocation$,
      this.selectedLocationSubject$,
    );

    this.inventoryGroupIdControl.valueChanges
    .subscribe((id) => {
      this.locationIdControl.patchValue(null);
      this.storageLocationIdControl.patchValue(null);
    });

    this.selectedLocation$
    .filter((location) => !!location)
    .subscribe((location) => {
      this.locationIdControl.patchValue(location.location_id);
      this.storageLocationIdControl.patchValue(location.storage_location_id);
    });

  }

  selectInventoryGroup(event: ReceivedInventoryGroupModel) {
    this.selectedInventoryGroupSubject$.next(event);
    this.inventoryGroupIdControl.patchValue(event && event.id);
    this.inventoryGroupIdControl.markAsDirty();
  }

  selectLocation(location) {
    this.selectedLocationSubject$.next(location);
  }

  removeStatus() {
    this.remove.emit();
  }

}
