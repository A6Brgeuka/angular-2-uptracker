/* tslint:disable:no-unused-variable */
import "materialize-css";
import "angular2-materialize";


import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SpinnerModule } from "./spinner/spinner.module";
import { NoContentModule } from "./no-content/no-content.module";
import { AuthModule } from "./auth/auth.module";
import { routing } from "./app.routing";
import { CoreModule } from "./core/core.module";
import { APP_BASE_HREF } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: 'app-spinner',
  template: `<div>Spinner</div>`
})
export class Spinner {

}

describe('App: FrontendUptracker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        Spinner
      ],
      imports: [
        CoreModule,
        routing,

        AuthModule,
        NoContentModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue : '/' }
      ]

    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should create the spinner component', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement;
    expect(app.children[0].name).toEqual("app-spinner");
  }));

  it('should create the router-outlet component', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement;
    expect(app.children[1].name).toEqual("router-outlet");
  }));



});
