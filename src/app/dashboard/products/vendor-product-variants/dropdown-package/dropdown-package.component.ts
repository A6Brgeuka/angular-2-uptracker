import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-dropdown-package',
  templateUrl: 'dropdown-package.component.html',
  styleUrls: ['dropdown-package.component.scss'],
  host: {
    "(document:click)": "onClick($event)"
  }
})
export class DropdownPackageComponent {

  @Input('autocompletePackage') public autocompletePackage: any;
  @Input('packageLabel') public packageLabel: any;
  @Output('packageLabelChange')  public packageLabelChange: EventEmitter<any> = new EventEmitter<any>();

  public isOpen: boolean = false;
  constructor(private ref: ElementRef) { }

  packageChange(value) {
    this.packageLabelChange.emit(value);
    this.isOpen = true;

    const index = this.getItemIndex(value);
    if (index >= 0) {
      const targetUl = this.ref.nativeElement.querySelector('ul');
      const targetLi = this.ref.nativeElement.querySelector(`[data-index='${index}']`);

      if (targetUl && targetLi) {
        targetUl.scrollTop = targetLi.offsetTop; // window.getComputedStyle(targetUl)['margin-top']
      }
    }
  }

  onClick() {
    if (!this.ref.nativeElement.contains(event.target))
      this.isOpen = false;
  }

  onSelect(value) {
    this.packageChange(value);
    this.toggleSubMenu();
  }

  toggleSubMenu() {
    this.isOpen = !this.isOpen;
  }

  getItemIndex(value) {
    let index = -1;

    if (value) {
      _.each(this.autocompletePackage, (item: any, key: number) => {
        const itemValue = item && item['unit_name'];
        if (itemValue) {
          if (itemValue.toLowerCase().startsWith(value.toLowerCase())) {
            index = key;
            return false;
          }
        }
      });
    }

    return index;
  }
}
