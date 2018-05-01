import { NgModule } from '@angular/core';
import {UploadEditFileComponent} from "./upload-edit-file.component";
import {ImageCropperModule} from 'ng2-img-cropper';
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    UploadEditFileComponent
  ],
  exports: [
    UploadEditFileComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule
  ],
  providers: [],
})
export class UploadEditFileModule { }
