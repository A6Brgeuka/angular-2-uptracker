import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductFromVendorStep2Component } from './add-product-from-vendor-step2.component';

describe('AddProductFromVendorStep2Component', () => {
  let component: AddProductFromVendorStep2Component;
  let fixture: ComponentFixture<AddProductFromVendorStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductFromVendorStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductFromVendorStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
