import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Modal } from 'angular2-modal';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { ReceivedOrderService } from '../../../../../core/services/received-order.service';

import { OrderStatusValues } from '../../../models/order-status';
import { OrderItemStatusFormGroup, OrderReceivingStatus } from '../../models/order-item-status-form.model';
import { ReceivedInventoryGroupModel } from '../../models/received-inventory-group.model';
import { ReceiveService } from '../../receive.service';
import { AddInventoryModal } from '../../../../inventory/add-inventory/add-inventory-modal.component';
import { ModalWindowService } from '../../../../../core/services/modal-window.service';

@Component({
  selector: 'app-receive-new-status-item',
  templateUrl: './receive-new-status-item.component.html',
})
@DestroySubscribers()

export class ReceiveNewStatusItemComponent implements OnInit {
  public subscribers: any = {};
  public receiveStatus = OrderStatusValues.receive;

  public statusList$: Observable<OrderReceivingStatus[]>;

  public locations$: ReplaySubject<any[]> = new ReplaySubject(1);
  public inventoryGroup$: ReplaySubject<ReceivedInventoryGroupModel> = new ReplaySubject(1);
  public inventoryGroups$: ReplaySubject<ReceivedInventoryGroupModel[]> = new ReplaySubject(1);
  public selectedInventoryGroup$: ReplaySubject<ReceivedInventoryGroupModel> = new ReplaySubject(1);

  selectedLocation$: Observable<any>;
  selectedLocationSubject$: Subject<any> = new Subject();

  createInventoryGroupSubject$: Subject<any> = new Subject();

  formSubmitted$: Observable<boolean>;

  selectedStatusList$: ReplaySubject<OrderReceivingStatus[]> = new ReplaySubject(1);

  @Input() public statusFormGroup: OrderItemStatusFormGroup;

  @Input() public inventoryGroupIdControl: FormControl;
  @Input() public itemProductVariantId = '';
  @Input('locations')
  set locations(value){
    this.locations$.next(value);
  };

  @Input('inventoryGroup') set inventoryGroup(value) {
    this.inventoryGroup$.next(value);
  };
  @Input('inventoryGroups') set inventoryGroups(value) {
    this.inventoryGroups$.next(value);
  };
  @Input('selectedInventoryGroup') set selectedInventoryGroup(value) {
    this.selectedInventoryGroup$.next(value);
  };

  @Input() pendingQty = 0;

  @Input()
  set selected(list) {
    this.selectedStatusList$.next(list);
  }

  @Output() remove = new EventEmitter();
  @Output() createInventoryEvent = new EventEmitter();
  @Output() selectedInventoryEvent = new EventEmitter();

  constructor(
    public receivedOrderService: ReceivedOrderService,
    private receiveService: ReceiveService,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public route: ActivatedRoute,
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

  get primaryStatusControl() {
    return this.statusFormGroup.get('primary_status');
  }

  ngOnInit() {

    const selectedWithoutCurrent$ = this.selectedStatusList$.asObservable()
    .map((list) => list.filter((item) => item.value !== this.typeControl.value));

    this.statusList$ = Observable.combineLatest(
      this.receivedOrderService.statusList$,
      selectedWithoutCurrent$,
    )
    .map(([statusList, selectedList]) => _.differenceWith(statusList, selectedList, _.isEqual))
    .map((statusList) => statusList.filter((status) => status.value !== OrderStatusValues.pending));

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

    this.formSubmitted$ = this.receiveService.formSubmitted$;

  }

  addSubscribers() {

    this.subscribers.primaryStatusSubscribtion = this.typeControl.valueChanges
    .subscribe((status) => {
      this.primaryStatusControl.patchValue(status === OrderStatusValues.receive);
    });

    this.subscribers.inventoryGroupIdControlSubscription = this.inventoryGroupIdControl.valueChanges
    .subscribe((id) => {
      this.locationPatchValue();
    });

    this.subscribers.selectedLocationSubscription = this.selectedLocation$
    .filter((location) => !!location)
    .subscribe((location) => {
      this.locationPatchValue(location.location_id, location.storage_location_id);
    });

    this.subscribers.getProductFieldSubscription = this.createInventoryGroupSubject$
      .switchMap(() => {
        return this.receivedOrderService.getProductFields(this.itemProductVariantId)
        .map(res => {
          this.modal
          .open(AddInventoryModal, this.modalWindowService.overlayConfigFactoryWithParams({'selectedProduct': res, 'inventoryItems': []}))
          .then((resultPromise) => {
            resultPromise.result.then(
              (res) => {
                this.createInventoryEvent.emit('success');
              },
              (err) => {}
            );
          });
        });
      })
      .subscribe();
  }

  selectInventoryGroup(event: ReceivedInventoryGroupModel) {
    if (event.id === 'create') {
      this.createInventoryGroupSubject$.next(event);
    } else {
      this.selectedInventoryEvent.emit(event);
      this.inventoryGroupIdControl.patchValue(event && event.id);
      this.inventoryGroupIdControl.markAsDirty();
    }
  }

  selectLocation(location) {
    this.selectedLocationSubject$.next(location);
  }

  removeStatus() {
    this.remove.emit();
  }

  locationPatchValue(locationId = null, storageLocationId = null) {
    this.locationIdControl.patchValue(locationId);
    this.locationIdControl.markAsDirty();
    this.locationIdControl.markAsTouched();
    this.storageLocationIdControl.patchValue(storageLocationId);
    this.storageLocationIdControl.markAsDirty();
    this.storageLocationIdControl.markAsTouched();

  }

}
