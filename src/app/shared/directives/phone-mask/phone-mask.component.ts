import {
  Directive,
  Component,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewContainerRef,
  OnInit
} from '@angular/core';

import { PhoneMaskService } from '../../../core/services/index';

@Component({
  // selector: '[intl-phone-mask]',
  selector: 'phone-input',
  templateUrl: './phone-mask.component.html',
  styleUrls: ['./phone-mask.component.scss'],
  host: {
    '(document: mousedown)': 'onDocumentClick($event)',
  }
})
export class IntlPhoneMaskDirective implements OnInit {
  private element: ElementRef;

  @Input() selectedCountry: any = [ "United States", "us", "1", 0 ];
  @Output('onCountryChange') countryChangeEvent = new EventEmitter();

  public input = {};
  // private selectedCountry: any = [];
  private viewCountryList: boolean = false;
  public allCountries = [];

  someDynamicHtml =
    '<div class="flag-container">' +
    '<div class="selected-flag" (click)="viewCountryList = !viewCountryList">' +
    '<div class="iti-flag {{selectedCountry[1]}}"></div>' +
    '<div class="iti-arrow"></div>' +
    '</div>' +
    '<ul class="country-list" [class.hide]="!viewCountryList">' +
    '<li class="country" [class.highlight]="country[1] == selectedCountry[1]" *ngFor="let country of allCountries" (click)="selectCountry(country)">' +
    '<div class="flag-box"><div class="iti-flag {{country[1]}}"></div></div>' +
    '<span class="country-name">{{country[0]}}</span>' +
    '<span class="dial-code">+{{country[2]}}</span>' +
    '</li>' +
    '</ul>' +
    '</div>';

  public constructor(
    element: ElementRef,
    phoneMaskService: PhoneMaskService
  ) {
    this.element = element;

    // this.input = {
    //   id: this.id,
    //   name: this.name,
    //   placeholder: this.placeholder,
    //   class: this.class,
    //   mask: this.textMask,
    //   model: this.model
    // };
    this.allCountries = phoneMaskService.allCountries;
  }

  ngOnInit(){
    // this.wrap(this.element.nativeElement);
  }

  wrap (toWrap) {
    let self = this;
    let wrapper = document.createElement('div');
    wrapper.className = "intl-tel-input allow-dropdown";
    let flagContainer = document.createElement('div');
    flagContainer.className = "flag-container";
    flagContainer.addEventListener('click', function(){
      self.viewCountryList = !self.viewCountryList;
    });
    // wrapper.innerHTML = this.someDynamicHtml;
    if (toWrap.nextSibling) {
      toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);
    } else {
      toWrap.parentNode.appendChild(wrapper);
    }
    return wrapper.appendChild(toWrap);
  }

  selectCountry(country){
    this.selectedCountry = country;

    this.viewCountryList = false;
    this.countryChangeEvent.emit(this.selectedCountry);
  }

  onDocumentClick($event){
    if (!this.element.nativeElement.contains($event.target)) 
      this.viewCountryList = false;
  }

}
