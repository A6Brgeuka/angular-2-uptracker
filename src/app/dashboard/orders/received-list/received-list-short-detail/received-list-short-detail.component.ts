import { Component, Input } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-received-list-detail',
  templateUrl: './received-list-short-detail.component.html',
  styleUrls: ['./received-list-short-detail.component.scss']
})
@DestroySubscribers()
export class ReceivedListShortDetailComponent {
  public subscribers: any = {};
  
  @Input("item") public item: any = [];
  @Input("visible") public visible;

  constructor(

  ) {

  }

  toggleVariantVisibility(variant) {
    variant.status = variant.status == 2 ? variant.status =1 : variant.status = 2;
  }
  
}
