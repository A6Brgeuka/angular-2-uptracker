import {Component, forwardRef, OnInit, Input} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PriceInputComponent),
  multi: true
};

@Component({
  selector: 'app-price-input',
  templateUrl: './price-input.component.html',
  styleUrls: ['./price-input.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class PriceInputComponent implements OnInit, ControlValueAccessor {
  private _innerValue: any;
  @Input('placeholder') public placeholder: any;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor() { }

  ngOnInit() {
  }

  get value(): any {
    return this._innerValue;
  }

  set value(v: any) {
    if (v !== this._innerValue) {
      this._innerValue = v;
      this.onChangeCallback(v);
    }
  }

  onBlur() {
    this.onTouchedCallback();
  }

  writeValue(value: any) {
    if (value !== this._innerValue) {
      this.onChangeListPrice(value)
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  changePrice(val) {
    const regex = /[\d\.]*/g;
    const m: any = regex.exec(val);
    regex.lastIndex++;
    const m1: any = regex.exec(val);
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

  onChangeListPrice(val) {
    const value = this.changePrice(val);
    this._innerValue = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }


}
