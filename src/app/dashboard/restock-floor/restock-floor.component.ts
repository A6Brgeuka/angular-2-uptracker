import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

import { RestockService } from '../../core/services/restock.service';


@Component({
  selector: 'app-restock-floor',
  templateUrl: './restock-floor.component.html',
  styleUrls: ['./restock-floor.component.scss']
})
export class RestockFloorComponent implements OnInit {
  public locations: any = []
  public currentFloorstockLocation: any = {}
  public keywordSearchValue: any = ''

  constructor(
    // TODO: use RestockService once the API stops 404'ing
    public restockService: RestockService,
    private _location: Location
  ) {
    this.locations = []
    this.currentFloorstockLocation = {}
    this.keywordSearchValue = ''

  }

  ngOnInit() {
    this.locations = this.restockService.selfData$
      .map((response: any) => response)
  }

  selectFloorstockLocation(location) {
    this.currentFloorstockLocation = location
  }

  onChange(e, inventoryGroupObj, byOnFloor ) {
    const inputValue = e.target.value
    inventoryGroupObj.restock_qty = byOnFloor ? inventoryGroupObj.suggested_on_floor - inputValue : inputValue
  }

  clearKeywordSearchValue() {
    this.keywordSearchValue = ''
  }

  goBack() {
    this._location.back()
  }
}
