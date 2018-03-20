import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-input',
  templateUrl: './price-input.component.html',
  styleUrls: ['price-input.component.scss']
})
export class PriceInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  changePrice(val) {
    const regex = /[\d\.]*/g;
    let m: any = regex.exec(val);
    regex.lastIndex++;
    let m1: any = regex.exec(val);
    if (m && m[0]) {
      val = parseFloat(m[0] ? m[0] : '0');
    } else if (m1 && m1[0]) {
      val = parseFloat(m1[0] ? m1[0] : '0');
    }
    if (!val) {
      val = 0;
    }
    return val;
  }

  /*onChangeListPrice(val) {
    let value = this.changePrice(val);
    this.newProductData.list_price = value;
    this.newProductData.formattedPrice = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }*/

}
