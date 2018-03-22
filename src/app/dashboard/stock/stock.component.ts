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
  constructor(
    public modal: Modal,
  ) {}

  ngOnInit() {}
}
