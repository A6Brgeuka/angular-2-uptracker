import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantComponent } from './product-variant.component';

describe('ProductVariantComponent', () => {
  let component: ProductVariantComponent;
  let fixture: ComponentFixture<ProductVariantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductVariantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
