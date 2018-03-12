import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductModalComponent } from './add-market-product-modal.component';

describe('AddProductModalComponent', () => {
  let component: AddProductModalComponent;
  let fixture: ComponentFixture<AddProductModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
