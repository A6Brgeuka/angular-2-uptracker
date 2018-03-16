import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductFromVendorStep1Component } from './add-product-from-vendor-step1.component';

describe('AddProductFromVendorStep1Component', () => {
  let component: AddProductFromVendorStep1Component;
  let fixture: ComponentFixture<AddProductFromVendorStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductFromVendorStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductFromVendorStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
