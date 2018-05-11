import { Component, forwardRef, OnInit, ViewChild, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl } from "@angular/forms";

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ReconcileTooltipComponent),
  multi: true
};

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ReconcileTooltipComponent),
  multi: true
};

declare var ReconcileTooltip: any;


@Component({
  selector: 'reconcile-tooltip',
  templateUrl: './reconcile-tooltip.component.html',
  styleUrls: ['./reconcile-tooltip.component.scss'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    CUSTOM_INPUT_VALIDATORS
  ]
})

export class ReconcileTooltipComponent implements ControlValueAccessor, OnInit {
  onChange = (_: any): void => {};
  onTouched = (_: any): void => {};
  reconciled_package_price: any = {};
  state: number = 10;
  package_price: string = '';
  reconcileType: string = '';
  visible: boolean = false;

  @Input()
  set price(value: any) {
    this.package_price = value;
  }
  @Output() selectDiscount: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  writeValue(v): void {
    this.reconciled_package_price = v || {};
    if (this.package_price > this.reconciled_package_price) {
      this.visible = true;
      this.state = 10;
    } else if (this.package_price < this.reconciled_package_price) {
      this.visible = true;
      this.state = 12;
    }
    if (this.reconcileType == 'discount') {
      this.selectDiscount.next()
    }
  }

  validate(c: FormControl): any {
    return true; /* TODO Investigate what was wrong with previous validation */
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn; 
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn; 
  }

  changeTooltip(button) {
    if (button == 'next') {
      if (this.reconcileType == 'discount') {
        this.state = 11;
      } else if (this.reconcileType == 'price') {
        this.state = 12;
      }
    } else if (button == 'yes') {
      this.state = 13;
    } else if (button == 'no') {
      this.state = 14;
    } else {
      this.visible = false;
    }
  }

  onDiscount() {
    this.selectDiscount.next()
  }
}
