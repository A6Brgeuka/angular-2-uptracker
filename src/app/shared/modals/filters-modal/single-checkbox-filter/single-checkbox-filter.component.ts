import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-single-checkbox-filter',
  templateUrl: './single-checkbox-filter.component.html',
})
export class SingleCheckboxFilterComponent {
  @Input() title: string;
}
