import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Modal } from 'angular2-modal';
import * as _ from 'lodash';

import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ReceivedOrderService } from '../../../../core/services/received-order.service';
import {
  OrderItemStatusFormGroup, OrderItemStatusFormModel,
  OrderReceivingStatus
} from '../models/order-item-status-form.model';
import { ReceiveService } from '../receive.service';
import { Observable } from 'rxjs/Observable';
import { OrderItemFormGroup, ReceiveOrderItemModel } from '../models/order-item-form.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { OrderStatusValues } from '../../models/order-status';
import { ActivatedRoute } from '@angular/router';
import { ReceivedInventoryGroupModel } from '../models/received-inventory-group.model';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-receive-item',
  templateUrl: './receive-item.component.html',
  styleUrls: ['./receive-item.component.scss'],
})
@DestroySubscribers()

export class ReceiveItemComponent implements OnInit, OnDestroy {

  public minItemQuantity: number;
  public itemTotal: number;

  public statusList: OrderReceivingStatus[] = this.receivedOrderService.statusList;
  public statusList$: Observable<OrderReceivingStatus[]> = this.receivedOrderService.statusList$;

  public order$: Observable<any>;
  public item$: Observable<ReceiveOrderItemModel>;
  public itemQuantity$: Observable<number>;
  public statusLineTotal$: Observable<number>;
  public statusTotal$: Observable<number>;
  public pendingQty$: ConnectableObservable<number>;
  public statusLineItems$: Observable<OrderItemStatusFormModel[]>;
  public statusItems$: Observable<OrderItemStatusFormModel[]>;
  public inventoryGroupIds$: Observable<any[]>;
  public itemProductVariantId$: Observable<any>;
  public statusItemStatuses$: Observable<OrderReceivingStatus[]>;
  public statusLineQtyItems$: Observable<OrderItemStatusFormModel[]>;

  public formSubmitted$: Observable<boolean>;

  public inventoryGroup$: Observable<ReceivedInventoryGroupModel>;
  public inventoryGroups$: Observable<ReceivedInventoryGroupModel[]>;
  public locations$: Observable<any[]>;

  selectedInventoryGroup$: ConnectableObservable<ReceivedInventoryGroupModel>;
  selectedInventoryGroupSubject$: Subject<ReceivedInventoryGroupModel> = new Subject();

  public inventoryGroupIds: string[] = [];

  @Input() orderItemForm: OrderItemFormGroup;
  @Input() orderId: string;
  @Input() itemId: string;

  @Output() createInventoryEvent = new EventEmitter();

  private pendingQty: number;
  private subscribers: any = {};

  constructor(
    public inventoryService: InventoryService,
    public toasterService: ToasterService,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public receivedOrderService: ReceivedOrderService,
    public receiveService: ReceiveService,
    private route: ActivatedRoute,
  ) {

  }

  get statusControl() {
    return this.orderItemForm.get('status') as FormArray;
  }

  get statusLineItemsControl() {
    return this.orderItemForm.get('status_line_items') as FormArray;
  }

  get inventoryGroupIdControl() {
    return this.orderItemForm.get('inventory_group_id');
  }

  get quantityControl() {
    return this.orderItemForm.get('quantity');
  }

  get noteControl() {
    return this.orderItemForm.get('note');
  }

  get editQty() {
    return this.noteControl.enabled && this.quantityControl.enabled;
  }

  ngOnInit() {

    this.formSubmitted$ = this.receiveService.formSubmitted$;

    this.order$ = this.receiveService.getOrder(this.orderId);

    this.item$ = this.receiveService.getItem(this.itemId);

    this.itemQuantity$ = this.getFormQuantity();

    this.statusLineQtyItems$ = this.getFormStatusLineQtyItems();

    this.statusLineItems$ = this.getFormStatusLineItems();

    this.statusLineTotal$ = this.statusLineItems$
    .map(this.getOrderStatusTotal);

    this.statusItems$ = this.getFormStatusItems();

    this.statusTotal$ = this.statusItems$
    .map(this.getOrderStatusTotal);


    this.statusItemStatuses$ = Observable.combineLatest(
      this.statusItems$,
      this.statusList$
    )
    .map(([statusLineItems, statusList]) => {
      const statusLineItemsStatus = statusLineItems.map((item) => ({value: item.type}));
      return _.intersectionBy(statusList, statusLineItemsStatus, 'value');
    });

    this.pendingQty$ = Observable.combineLatest(
      this.itemQuantity$,
      this.statusLineTotal$,
      this.statusTotal$,
    )
    .map(([orderTotal, statusLineTotal, statusTotal]) =>
      orderTotal - statusLineTotal - statusTotal
    )
    .distinctUntilChanged()
    .publishReplay(1);
    this.pendingQty$.connect();

    this.inventoryGroupIds$ = this.item$
    .filter((r) => !!r)
    .map((item) => _.map(item.inventory_groups, 'id'));

    this.inventoryGroupIds$.subscribe(res => {this.inventoryGroupIds = res; });

    this.itemProductVariantId$ = this.item$
    .filter((r) => !!r)
    .map((item) => item.variant_id);

    // Adding Quantity validators
    this.orderItemForm.setValidators([this.getItemQuantityMinValueValidator(), this.statusMaxValueValidator()]);

    const inventoryGroupId = this.inventoryGroupIdControl.value;
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

    this.selectedInventoryGroup$ = Observable.merge(
      this.inventoryGroup$,
      this.selectedInventoryGroupSubject$,
    ).publishReplay(1);
    this.selectedInventoryGroup$.connect();

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

  }

  addSubscribers() {
    const statusType$ = this.route.queryParams
    .pluck('type')
    .map((type) => _.find(this.statusList, {value: `${type}`}))
    .map((type) => type && type.value);

    this.subscribers.pendingQtySubscription = this.pendingQty$
    .take(1)
    .withLatestFrom(statusType$)
    .filter(([qty, type]: [number, string]) => !!type)
    .subscribe(([qty, type]: [number, string]) => {
      const data: OrderItemStatusFormModel = {
        primary_status: type === 'receive',
        location_id: null,
        storage_location_id: null,
        type,
        qty,
      };

      this.addStatusControl(data);
    });

    this.subscribers.minQtySubscriber = Observable.combineLatest(
      this.statusItems$,
      this.statusLineItems$.map((items) => items.filter((item: any) => !item.delete)),
      (statusItems, statusLineItems) => {
        const receiveList = [...statusItems, ...statusLineItems].filter((item) =>
          item.type === OrderStatusValues.receive
        );
        return receiveList.reduce((sum, item) => sum + item.qty, 0);
      }
    )
    .subscribe(qty => {
      this.minItemQuantity = qty;
    });

    this.subscribers.itemTotalSubscribtion = this.item$
    .filter((r) => !!r)
    .map((item) => item.quantity)
    .subscribe((total) => {
      this.itemTotal = total;
    });

    this.subscribers.pendingQtySubscribtion = this.pendingQty$
    .subscribe((qty) => {
      this.pendingQty = qty;
    });

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  editQtyToggle() {
    if (this.editQty) {
      this.quantityControl.disable();
      this.noteControl.disable();
      this.quantityControl.reset(this.itemTotal);
    } else {
      this.quantityControl.enable();
      this.noteControl.enable();
    }
  }

  removeStatus(index) {
    this.statusControl.removeAt(index);
  }

  onStatusAdd({type, qty}) {
    this.addStatusControl({
      type,
      qty,
      primary_status: type === OrderStatusValues.receive,
      location_id: null,
      storage_location_id: null,
    });
  }

  private getFormStatusLineQtyItems() {
    return this.item$
    .filter((item) => !!item && !!item.status_line_items)
    .map((item) =>
      item.status_line_items && item.status_line_items.filter((statusItem) => statusItem.qty_change)
    );
  }

  private getFormStatusLineItems() {
    return this.statusLineItemsControl.valueChanges
    .startWith(this.statusLineItemsControl.value)
    .shareReplay(1);
  }

  private getFormStatusItems() {
    return this.statusControl.valueChanges
    .startWith(this.statusControl.value)
    .distinctUntilChanged(_.isEqual)
    .shareReplay(1);
  }

  private getFormQuantity() {
    return this.quantityControl.valueChanges
    .startWith(this.quantityControl.value)
    .shareReplay(1);
  }

  private getOrderStatusTotal(statusLineItems: OrderItemStatusFormModel[]) {
    if (!_.isArray(statusLineItems)) {
      return 0;
    }
    return statusLineItems
    .filter((status: any) => !status.delete)
    .reduce((sum, status) => sum + status.qty, 0);
  }

  private addStatusControl(data) {
    this.statusControl.push(new OrderItemStatusFormGroup(data));
  }

  private statusMaxValueValidator() {
    return (ctrl: FormGroup) =>
      this.pendingQty >= 0 ? null : {maxItemsQty: true};
  };

  private getItemQuantityMinValueValidator() {
    return (ctrl: FormControl) => {
      const quantityCtrl = ctrl.get('quantity');
      const noteCtrl = ctrl.get('note');
      if (quantityCtrl.enabled && noteCtrl.enabled) {
        return quantityCtrl.value >= this.minItemQuantity ? null : {minItemQty: true};
      }
      return null;
    };
  }

  createNewInventoryEvent(e) {
    this.createInventoryEvent.emit(e);
  }

  selectedInventoryEvent(e) {
    this.selectedInventoryGroupSubject$.next(e);
  }

}
