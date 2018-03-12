import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductFromVendorComponent } from './add-product-from-vendor.component';

describe('AddProductFromVendorComponent', () => {
  let component: AddProductFromVendorComponent;
  let fixture: ComponentFixture<AddProductFromVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductFromVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductFromVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
