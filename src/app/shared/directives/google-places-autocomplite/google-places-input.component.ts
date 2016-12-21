declare let google: any;

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
  OnInit,
  ViewChild
} from '@angular/core';


import * as _ from 'lodash';
import { MapsAPILoader } from "angular2-google-maps/core";
import { FormControl } from "@angular/forms";


@Component({
  selector: 'google-places-input',
  templateUrl: './google-places-input.component.html',
  styleUrls: ['./google-places-input.component.scss'],
})
export class GooglePlacesInputComponent implements OnInit {

  public searchControl: FormControl;

  @ViewChild("search")  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader) {
    debugger;
  }

  ngOnInit(){


    this.searchControl = new FormControl();


  }

  ngAfterContentInit() {
    this.mapsAPILoader.load().then(() => {
      new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
    });
  }


}
