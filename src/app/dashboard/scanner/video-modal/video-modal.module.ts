import { NgModule } from '@angular/core';
import { VideoModal } from './video-modal.component';
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    VideoModal
  ],
  imports: [
    CommonModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ VideoModal ]
})
export class VideoModule {
}
