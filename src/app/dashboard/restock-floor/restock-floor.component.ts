import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToasterService } from '../../core/services/toaster.service';

import { RestockService, RestockOptions } from '../../core/services/restock.service';


@Component({
  selector: 'app-restock-floor',
  templateUrl: './restock-floor.component.html',
  styleUrls: ['./restock-floor.component.scss']
})
export class RestockFloorComponent implements OnInit {
  public locations: any = [];
  public currentFloorstockLocation: any = {};
  public keywordSearchValue: any = '';

  constructor(
    public restockService: RestockService,
    private _location: Location,
    private toasterService: ToasterService
  ) {
    this.locations = [];
    this.currentFloorstockLocation = {};
    this.keywordSearchValue = '';

  }

  ngOnInit() {
    this.locations = this.restockService.selfData$
      .map((response: any) => response);
  }

  selectFloorstockLocation(location) {
    this.currentFloorstockLocation = location;
  }

  calculateRestockQty(e, inventoryGroupObj) {
    const on_floor_qty = parseInt(e.target.value, 10);

    if (isNaN(on_floor_qty)) {
      inventoryGroupObj.restock_qty = '';
      inventoryGroupObj.on_floor_qty = '';
    } else {
      inventoryGroupObj.restock_qty = inventoryGroupObj.suggested_on_floor - on_floor_qty;
      inventoryGroupObj.on_floor_qty = on_floor_qty;
    }
  }

  calculateOnFloorQty(e, inventoryGroupObj) {
    const restock_qty = parseInt(e.target.value, 10);

    if (isNaN(restock_qty)) {
      inventoryGroupObj.on_floor_qty = '';
      inventoryGroupObj.restock_qty = '';
    } else {
      inventoryGroupObj.on_floor_qty = inventoryGroupObj.suggested_on_floor - restock_qty;
      inventoryGroupObj.restock_qty = restock_qty;
    }
  }

  submitRestock(inventoryGroupObj) {
    const restock_qty = inventoryGroupObj.restock_qty;

    if (isNaN(restock_qty) || restock_qty < 1) {
      this.toasterService.pop('error', 'Restock Qty is invalid, it must be a number greater than 0');
    } else {
      const restockData = new RestockOptions();
      restockData.restock_qty = restock_qty;
      restockData.floorstock_location_id = this.currentFloorstockLocation.id;
      restockData.inventory_group_id = inventoryGroupObj.id;

      this.locations = this.restockService.submit(restockData)
    }
  }

  lastRestockText(inventoryGroupObj) {
    const lastRestockQty = inventoryGroupObj.last_restock_qty;
    const lastRestockDate = inventoryGroupObj.last_restock_date;
    if (lastRestockQty && lastRestockDate) {
      return `${lastRestockQty} Item${lastRestockQty === 1 ? '' : 's'} on ${lastRestockDate}`;
    } else {
      return 'N/A';
    }
  }

  clearKeywordSearchValue() {
    this.keywordSearchValue = '';
  }

  goBack() {
    this._location.back();
  }
}
