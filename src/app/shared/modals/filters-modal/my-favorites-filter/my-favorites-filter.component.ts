import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-my-favorites-filter',
  templateUrl: './my-favorites-filter.component.html',
})
export class MyFavoritesFilterComponent {
  public myFavorite = new FormControl();
}
