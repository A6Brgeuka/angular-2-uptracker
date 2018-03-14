import { Component } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-department-filter',
  templateUrl: './department-filter.component.html',
})
@DestroySubscribers()
export class DepartmentFilterComponent {
  public departmentCollection$: Observable<string[]> = this.accountService.getDepartments();

  constructor(
    private accountService: AccountService,
  ) {
  }

}
