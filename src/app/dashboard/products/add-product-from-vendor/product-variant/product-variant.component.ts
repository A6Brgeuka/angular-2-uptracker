import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-product-variant',
  templateUrl: 'product-variant.component.html',
  styleUrls: ['product-variant.component.scss']
})
export class ProductVariantComponent implements OnInit {

  @Input("variant") public variant;
  @Input("selectAll") public selectAll;

  myArray:any=['red', 'green', 'blue'];
  myPrice: number = 2;

  constructor() { }

  ngOnInit() {
  }

}
