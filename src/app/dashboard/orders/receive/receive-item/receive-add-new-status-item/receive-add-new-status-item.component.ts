import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import * as _ from 'lodash';

import { ReceivedOrderService } from '../../../../../core/services';

import { OrderReceivingStatus } from '../../models/order-item-status-form.model';
import { OrderStatusValues } from '../../../models/order-status';

@Component({
  selector: 'app-receive-add-new-status-item',
  templateUrl: './receive-add-new-status-item.component.html',
})

export class ReceiveAddNewStatusItemComponent implements OnInit {
  renderSelect$: Observable<boolean>;

  public pendingStatus = OrderStatusValues.pending;

  public statusList$: Observable<OrderReceivingStatus[]> = this.receivedOrderService.statusList$;
  public newStatusList$: ReplaySubject<OrderReceivingStatus[]> = new ReplaySubject<OrderReceivingStatus[]>(1);
  public remainingStatusList$: Observable<OrderReceivingStatus[]>;

  @Input() qty: number;

  @Input()
  set selected(value: OrderReceivingStatus[]) {
    this.newStatusList$.next(value);
  }

  @Output() statusAdd: EventEmitter<{type: string, qty: number}> = new EventEmitter();

  constructor(
    private receivedOrderService: ReceivedOrderService,
    public ngZone: NgZone,
  ) {
  }

  ngOnInit() {
    this.remainingStatusList$ = Observable.combineLatest(
      this.statusList$,
      this.newStatusList$,
    )
    .map(([statusList, newStatusList]) => {
      const filteredNewStatusList = _.reject(newStatusList, {'value': 'receive'});
      return _.differenceWith(statusList, filteredNewStatusList, _.isEqual);
    });

    /**
       use renderSelect for setting 'Pending' status after adding new status, because materialize select doesn't work as expected
     **/
    this.renderSelect$ = Observable.merge(
      this.remainingStatusList$.mapTo(false),
      this.remainingStatusList$.delayWhen(event => this.ngZone.onMicrotaskEmpty).mapTo(true),
    );
  }

  onListSelect(type) {
    if (type !== 'pending') {
      this.statusAdd.emit({
        type,
        qty: this.qty,
      });
    }
  }
}
