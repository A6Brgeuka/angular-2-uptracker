import { NgModule } from '@angular/core';

import { OnboardComponent } from './onboard.component';
import { AppSharedModule } from '../shared/shared.module';
import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
// import { SignupModule } from './signup/signup.module';

@NgModule({
  declarations: [
    OnboardComponent,
  ],
  imports: [
    AppSharedModule,
    
    LocationsModule,
    UsersModule,
    ProductsModule,
    // SignupModule
  ],
  providers: []
})
export class OnboardModule {
}