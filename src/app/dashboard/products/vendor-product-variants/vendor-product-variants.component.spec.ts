import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProductVariantsComponent } from './vendor-product-variants.component';

describe('VendorProductVariantsComponent', () => {
  let component: VendorProductVariantsComponent;
  let fixture: ComponentFixture<VendorProductVariantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorProductVariantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProductVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
