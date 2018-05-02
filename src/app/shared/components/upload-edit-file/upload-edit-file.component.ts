import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { CustomProductModel } from '../../../models/custom-product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-upload-edit-file',
  templateUrl: './upload-edit-file.component.html',
  styleUrls: ['./upload-edit-file.component.scss']
})

export class UploadEditFileComponent implements OnInit {

  name: string;
  dataCropImg: any;
  cropperSettings: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;
  showEditArea: boolean;
  @Input() product: CustomProductModel;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  constructor(private productService: ProductService) {
    this.name = 'CropImg';
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;

    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = true;

    this.cropperSettings.cropperDrawSettings.strokeColor = '#33c6d9';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

    this.cropperSettings.compressRatio = 1;
    this.cropperSettings.preserveSize = true;
    this.cropperSettings.noFileInput = true;

    this.showEditArea = false;
    this.dataCropImg = {
      image: ''
    };
  }

  ngOnInit() {

    // const image = new Image();
    // image.onload =  () =>{
    //
    //  this.cropper.setImage(image);
    //  console.log(canvas.toDataURL("image/jpeg"), canvas.width,canvas.height, image.width,image.height);
    //  this.dataCropImg.image = canvas.toDataURL("image/jpeg");
    //  console.log(this.dataCropImg.image)
    // };
    // image.crossOrigin = "Use-Credentials";
    // image.src = this.product.image;


  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }

  fileChangeListener($event) {
    this.showEditArea = true;
    const formData = new FormData();
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      console.log('image',image,$event.target.files[0]);
      this.cropper.setImage(image);
      formData.append('image', file);
      this.productService.addCustomProductImage(formData)
      .subscribe(url => {this.product.image = url; console.log("SUBSCRIBE URL")});
    };
    myReader.readAsDataURL(file);
  }


  rotateBase64Image(base64data) {
    const canvas: any = document.createElement('canvas');
    canvas.setAttribute('width', 200);
    canvas.setAttribute('height', 200);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(0,0);
    canvas.width=canvas.width;
    const image = new Image();
    image.src = base64data;
    image.onload =  () =>{
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(90* Math.PI / 180);
      ctx.drawImage(image, -100,-100, canvas.width,canvas.height);
      this.dataCropImg.image = canvas.toDataURL("image/jpeg");
    };
  }

  saveBlob(dataURI){
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const formData = new FormData();
    const croppedImage = blob;
    formData.append("image", croppedImage);
    this.productService.addCustomProductImage(formData)
    .subscribe(url => this.product.image = url);
  }


}
