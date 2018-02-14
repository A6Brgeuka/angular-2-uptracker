import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { RestockService } from '../../core/services/restock.service';


@Component({
  selector: 'app-restock-floor',
  templateUrl: './restock-floor.component.html',
  styleUrls: ['./restock-floor.component.scss']
})

@DestroySubscribers()
export class RestockFloorComponent implements OnInit {
  public locations: any = []
  public currentFloorstockLocation: any = {}
  public keywordSearchValue: any = ''

  constructor(
    // TODO: use RestockService once the API stops 404'ing
    // public restockService: RestockService
    private _location: Location
  ) {
    this.locations = []
    this.currentFloorstockLocation = {}
    this.keywordSearchValue = ''

  }

  ngOnInit() {
    this.locations = [
      {
        id: 1,
        name: 'Location A',
        floorstock_locations: [
          {
            id: 1,
            name: 'Lobby Island',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          },
          {
            id: 2,
            name: 'Lobby Desk',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          },
          {
            id: 3,
            name: 'Chairs 1 - 5',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          },
          {
            id: 4,
            name: 'Chairs 6 - 10',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Location B',
        floorstock_locations: [
          {
            id: 5,
            name: 'Lobby Island',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              },
              {
                name: 'Another product name',
                id: 2,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          },
          {
            id: 6,
            name: 'Lobby Desk',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          },
          {
            id: 7,
            name: 'Chairs 1 - 5',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          },
          {
            id: 8,
            name: 'Chairs 6 - 10',
            inventory_groups: [
              {
                name: 'Some product name',
                id: 1,
                suggested_on_floor: 10,
                on_hand: 0,
                restock_qty: 0,
                last_restock_date: '02/01/2018',
                last_restock_qty: 5
              }
            ]
          }
        ]
      }
    ];
  };

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
