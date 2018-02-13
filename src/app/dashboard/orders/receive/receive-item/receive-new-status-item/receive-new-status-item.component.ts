import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ReceivedOrderService } from '../../../../../core/services/received-order.service';

import { OrderStatusValues } from '../../../order-status';
import { OrderItemStatusFormGroup } from '../../models/order-item-status-form.model';
import { ReceivedInventoryGroupModel } from '../../models/received-inventory-group.model';
import { ReceiveService } from '../../receive.service';
import { AddInventoryModal } from '../../../../inventory/add-inventory/add-inventory-modal.component';
import { ModalWindowService } from '../../../../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receive-new-status-item',
  templateUrl: './receive-new-status-item.component.html',
})
@DestroySubscribers()

export class ReceiveNewStatusItemComponent implements OnInit {
  public subscribers: any = {};
  public receiveStatus = OrderStatusValues.receive;


  public statusList: any = this.receivedOrderService.statusList
  .filter((status) => status.value !== OrderStatusValues.pending);

  public inventoryGroup$: Observable<ReceivedInventoryGroupModel>;
  public inventoryGroups$: Observable<ReceivedInventoryGroupModel[]>;
  public isSelectDisabled$: Observable<boolean>;
  public locations$: Observable<any[]>;

  selectedInventoryGroupSubject$: Subject<ReceivedInventoryGroupModel> = new Subject();
  selectedInventoryGroup$: Observable<ReceivedInventoryGroupModel>;

  selectedLocation$: Observable<any>;
  selectedLocationSubject$: Subject<any> = new Subject();

  createInventoryGroupSubject$: Subject<any> = new Subject();

  @Input() public statusFormGroup: OrderItemStatusFormGroup;

  @Input() public inventoryGroupIdControl: FormControl;
  @Input() public inventoryGroupIds: string[] = [];
  @Input() public itemProductVariantId: string = '';

  @Input() pendingQty = 0;

  @Output() remove = new EventEmitter();
  @Output() createInventoryEvent = new EventEmitter();

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

  ngOnInit() {
    const inventoryGroupId = this.inventoryGroupIdControl.value
    this.inventoryGroup$ = this.receiveService.getInventoryGroup(inventoryGroupId);

    const createNewInventoryGroup: ReceivedInventoryGroupModel  = {id: 'create', locations: [], name: 'Create Inventory Group'};

    const inventoryGroupsByIds$: Observable<ReceivedInventoryGroupModel[]> =
      this.receiveService.getInventoryGroups(this.inventoryGroupIds)
      .map((inventoryGroups) => {
        return [createNewInventoryGroup, ...inventoryGroups];
      });

    this.inventoryGroups$ = inventoryGroupId ?
      this.inventoryGroup$.map((group) => [group]) :
      inventoryGroupsByIds$;
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

  }

  addSubscribers() {

    this.subscribers.inventoryGroupIdControlSubscription = this.inventoryGroupIdControl.valueChanges
    .subscribe((id) => {
      this.locationIdControl.patchValue(null);
      this.storageLocationIdControl.patchValue(null);
    });

    this.subscribers.selectedLocationSubscription = this.selectedLocation$
    .filter((location) => !!location)
    .subscribe((location) => {
      this.locationIdControl.patchValue(location.location_id);
      this.storageLocationIdControl.patchValue(location.storage_location_id);
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
      this.selectedInventoryGroupSubject$.next(event);
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

}
