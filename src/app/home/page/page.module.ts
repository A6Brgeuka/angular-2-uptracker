import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';
import { ModalModule } from 'angular2-modal';
import { PageComponent } from './page.component';
import { EmbededModule } from './embeded/embeded.module';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PageComponent
  ],
  imports: [
    AppSharedModule,
    EmbededModule,
  ],
  providers: [],
})
export class PageModule { }
