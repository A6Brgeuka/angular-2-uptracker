import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { comparator, equals, gt, prop, sort, sortBy } from 'ramda';
import { UserService, AccountService } from '../../core/services/index';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { UpdateStockModal } from './update-stock-modal/update-stock-modal.component';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  public sort: string = '';
  public filter: string = '';
  public products: Array<any> = [];
  public panelActive: boolean = false;
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
    this.products = [
      { title: 'Gloves Tender Touch Nitrile Sempecare', countBy: '1 Box (100)', currentQTY: 100, actualQTY: '', reason: 'N/A' },
      { title: 'Gloves Tender Touch Nitrile Sempecare', countBy: '1 Box (100)', currentQTY: 80, actualQTY: '', reason: 'N/A' },
      { title: '20GM Maximum cure sealant a-flouo', countBy: '1 Box (100)', currentQTY: 20, actualQTY: '', reason: 'N/A' },
      { title: '5GM Light bond medium pst-push-fluo', countBy: '1 Box (100)', currentQTY: 8, actualQTY: '', reason: 'N/A' },
      { title: 'A2 Tips', countBy: '1 Box (100)', currentQTY: 12, actualQTY: '', reason: 'N/A' },
    ]
  }

  ngOnInit() {}

  sortAlphabet(event) {
    if (equals(this.sort, 'A-Z')) {
      const ascComparator = comparator((a, b) => gt(prop('title', b), prop('title', a)));
      this.products = sort(ascComparator, this.products);
    } else {
      const desComparator = comparator((a, b) => gt(prop('title', a), prop('title', b)));
      this.products = sort(desComparator, this.products);
    }
  }

  sortUnit(event) {}

  filterChange(event) {}

  filtered(product) {
    if (!this.filter) {
      return true;
    }
    return product.title.indexOf(this.filter) > 0;
  }

  actualChange(event) {
    let active = false;
    this.products.forEach(product => {
      if (parseInt(product.actualQTY) > 0) active = true;
    })
    this.panelActive = active;
  }

  openSuccessModal() {
    this.modal
    .open(UpdateStockModal, this.modalWindowService.overlayConfigFactoryWithParams({'product': []}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {},
        (err) => {}
      );
    });
  }
}
