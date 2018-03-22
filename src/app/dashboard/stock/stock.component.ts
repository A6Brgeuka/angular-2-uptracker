import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { UserService, AccountService } from '../../core/services/index';
import * as _ from 'lodash';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  public sort: string = '';
  public filter: string = '';
  public products: Array<any> = [];
  constructor(
    public modal: Modal,
  ) {
    this.products = [
      { title: 'Gloves Tender Touch Nitrile Sempecare', countBy: '1 Box (100)', currentQTY: '100', actualQTY: '-', reason: 'N/A' },
      { title: 'Gloves Tender Touch Nitrile Sempecare', countBy: '1 Box (100)', currentQTY: '80', actualQTY: '-', reason: 'N/A' },
      { title: '20GM Maximum cure sealant a-flouo', countBy: '1 Box (100)', currentQTY: '20', actualQTY: '-', reason: 'N/A' },
      { title: '5GM Light bond medium pst-push-fluo', countBy: '1 Box (100)', currentQTY: '8', actualQTY: '-', reason: 'N/A' },
      { title: 'A2 Tips', countBy: '1 Box (100)', currentQTY: '12', actualQTY: '-', reason: 'N/A' },
    ]
  }

  ngOnInit() {}
  sortAlphabet() {}
  filterChange() {}
}
