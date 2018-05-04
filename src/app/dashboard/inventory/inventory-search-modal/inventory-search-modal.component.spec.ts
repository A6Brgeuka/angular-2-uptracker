import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySearchModalComponent } from './inventory-search-modal.component';

describe('InventorySearchModalComponent', () => {
  let component: InventorySearchModalComponent;
  let fixture: ComponentFixture<InventorySearchModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySearchModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
