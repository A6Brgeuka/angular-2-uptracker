/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { InventoryComponent } from './inventory.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InventoryModule } from './inventory.module';

describe('Component: Inventory', () => {
  
  let component = new InventoryComponent();
  let fixture: ComponentFixture<InventoryComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InventoryComponent
      ],
    });
  });
  
  it('should display the page header', () => {
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('div.main-title'));
    el = de.nativeElement;
  
    fixture.detectChanges();
    expect(el.textContent).toContain(component.title);
  });
  
  it('should display the page header changes', () => {
    
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('div.main-title'));
    el = de.nativeElement;
    component.title = "TestTitle";
    el = de.nativeElement;
    fixture.detectChanges();
    expect(el.textContent).toContain('TestTitle');
  });
  
});
