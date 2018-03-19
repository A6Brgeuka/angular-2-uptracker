import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseGlobalMarketModalComponent } from './browse-global-market-modal.component';

describe('BrowseGlobalMarketModalComponent', () => {
  let component: BrowseGlobalMarketModalComponent;
  let fixture: ComponentFixture<BrowseGlobalMarketModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseGlobalMarketModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseGlobalMarketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
