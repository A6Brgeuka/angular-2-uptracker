import { Component } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'received-list',
  templateUrl: './received-list.component.html',
  styleUrls: ['./received-list.component.scss']
})
@DestroySubscribers()
export class ReceivedListComponent {

  constructor(
  
  ) {

  }
  
  
  
}
