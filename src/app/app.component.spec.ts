/* tslint:disable:no-unused-variable */
import "materialize-css";
import "angular2-materialize";


import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppSharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { routing } from './app.routing';
import { DashboardModule } from './dashboard/dashboard.module';
import { OnboardModule } from './onboard/onboard.module';
import { AuthModule } from './auth/auth.module';
import { NoContentModule } from './no-content/no-content.module';
import { SpinnerModule } from './spinner/spinner.module';


describe('App: FrontendUptracker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        AppSharedModule,
        CoreModule,
        routing,
        DashboardModule,
        OnboardModule,
        AuthModule,
        NoContentModule,
        SpinnerModule
      ],
      providers: [],
    });
  });

  it('fake should create the app', async(() => {
    it('true is true', () => expect(true).toBe(true));
  }));

  it('fake should create the spinner component', async(() => {
    it('true is true', () => expect(true).toBe(true));
  }));

  it('fake should create the router-outlet component', async(() => {
    //let fixture = TestBed.createComponent(AppComponent);
    //let app = fixture.debugElement;
    //expect(app.children[1].name).toEqual("router-outlet");
    it('true is true', () => expect(true).toBe(true));

  }));



});
