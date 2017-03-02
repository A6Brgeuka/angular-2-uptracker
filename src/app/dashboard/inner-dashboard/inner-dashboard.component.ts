import { Component } from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-inner-dashboard',
  templateUrl: './inner-dashboard.component.html',
  styleUrls: ['./inner-dashboard.component.scss']
})
@DestroySubscribers()
export class InnerDashboardComponent {
  
}
