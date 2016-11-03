import { Injectable } from '@angular/core';

import { ExifService } from './exif.service';

@Injectable()
export class FileUploadService {
  constructor(
    private exifService: ExifService
  ) {
  }

  getOrientedImage(file){
    let img: any;
    
    let image = this.getImageFromBase64(file);
    let orientationNumber = this.getOrientation(file);

    if ([3, 6, 8].indexOf(orientationNumber) > -1) {
      let canvas: HTMLCanvasElement = document.createElement("canvas"),
          ctx: CanvasRenderingContext2D = canvas.getContext("2d"),
          cw: number = image.width,
          ch: number = image.height,
          cx: number = 0,
          cy: number = 0,
          deg: number = 0;

      switch (orientationNumber) {
        case 3:
          cx = -image.width;
          cy = -image.height;
          deg = 180;
          break;
        case 6:
          cw = image.height;
          ch = image.width;
          cy = -image.height;
          deg = 90;
          break;
        case 8:
          cw = image.height;
          ch = image.width;
          cx = -image.width;
          deg = 270;
          break;
        default:
          break;
      }

      canvas.width = cw;
      canvas.height = ch;
      ctx.rotate(deg * Math.PI / 180);
      ctx.drawImage(image, cx, cy);
      img = document.createElement("img");
      img.width = cw;
      img.height = ch;
      img.src = canvas.toDataURL("image/png");
    } else {
      img = image;
    }
    
    return img;
  }

  getOrientation(file){
    let buffer = this.exifService.base64ToArrayBuffer(file);
    let orientationNum = this.exifService.findEXIFinJPEG(buffer) ? this.exifService.findEXIFinJPEG(buffer)['Orientation'] : null;
    return orientationNum;
  }

  getImageFromBase64(file){
    let exif = this.exifService.findEXIFinJPEG(this.exifService.base64ToArrayBuffer(file));
    let image = new Image();
    image.src = file;
    image.width = exif.PixelXDimension;
    image.height = exif.PixelYDimension;

    return image;
  }
  
}
