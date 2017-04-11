import {
  Component, OnInit, ViewContainerRef, ReflectiveInjector, ComponentRef, Injector,
  Injectable, Renderer
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import {
  Overlay, overlayConfigFactory, DialogRef, createComponent, ModalOverlay,
  OverlayRenderer, DOMOverlayRenderer
} from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ModalWindowService } from "../../../core/services/modal-window.service";
import { UserService } from '../../../core/services/user.service';
import { CartService } from '../../../core/services/cart.service';
import { AccountService } from '../../../core/services/account.service';


@Component({
  selector: 'app-orders-preview',
  templateUrl: './orders-preview.component.html',
  styleUrls: ['./orders-preview.component.scss']
})
@DestroySubscribers()
export class OrdersPreviewComponent implements OnInit {
  public mockrows = [
    {name:'Some Product Name', location:'Location A', qty:'1', price:100},
    {name:'Some Product', location:'Location A', qty:'3', price:10},
    {name:'Some Name', location:'Location A', qty:'1', price:100},
  ];
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public accountService: AccountService,
    public cartService: CartService,
  ) {
  }
  
  ngOnInit() {
  }

}