import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProductModalComponent } from './add-new-product-modal.component';

describe('AddNewProductModalComponent', () => {
  let component: AddNewProductModalComponent;
  let fixture: ComponentFixture<AddNewProductModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewProductModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
