import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  styleUrls: [ './dashboard.style.scss' ],
  templateUrl: './dashboard.template.html'
})
export class DashboardComponent {
  public selectedOption = '';

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
