import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { RestockService } from '../../core/services/restock.service';


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
    // TODO: use RestockService once the API stops 404'ing
    public restockService: RestockService,
    private _location: Location
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
    inventoryGroupObj.restock_qty = isNaN(on_floor_qty) ? '' : inventoryGroupObj.suggested_on_floor - on_floor_qty;
  }

  calculateOnFloorQty(e, inventoryGroupObj) {
    const restock_qty = parseInt(e.target.value, 10);
    inventoryGroupObj.on_floor_qty = isNaN(restock_qty) ? '' : inventoryGroupObj.suggested_on_floor - restock_qty;
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
