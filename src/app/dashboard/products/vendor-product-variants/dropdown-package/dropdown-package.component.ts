import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';

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

  packageChange(value){
    this.packageLabelChange.emit(value);
    this.isOpen = true;
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

}
