import {Component, Output, EventEmitter, Input} from '@angular/core';
import {CustomProductVariantModel} from "../../../../models/custom-product.model";
import {InventoryService} from "../../../../core/services/inventory.service";
import {DestroySubscribers} from "ngx-destroy-subscribers";

@Component({
  selector: 'app-vendor-product-package',
  templateUrl: 'vendor-product-package.component.html',
  styleUrls: ['vendor-product-package.component.scss']
})

@DestroySubscribers()
export class VendorProductPackageComponent {

  @Input('package') public package: any;
  @Input('additional') public additional: boolean = true;
  @Output('fillColumn') fillColumn = new EventEmitter();
  @Output('fillAll') fillAll = new EventEmitter();

  public subscribers: any = {};
  public mainPrices: any = new CustomProductVariantModel();

  constructor(public inventoryService: InventoryService) {
  }

  onFillAll(price: string) {
    this.mainPrices.our_price = price;
    this.fillAll.emit(price);
  }

  onFillColumn(prop, value) {
    this.fillColumn.emit({prop, value});
  }

  packageSummary(pack): string {
    const inner = `of ${pack[1].qty} ${pack[1].label}`;
    const total = 1 * (pack[1].qty || 1) * pack[2].qty;
    return `1 ${pack[0].label} ${pack[1].label && pack[1].qty ? inner : ''} of ${pack[2].qty} ${pack[2].label}, 1 ${pack[0].label} = ${total} ${pack[2].label}(s)`;
  }
}
