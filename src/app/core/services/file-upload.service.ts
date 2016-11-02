import { Injectable } from '@angular/core';

import { Exif } from '../../exif';

@Injectable()
export class FileUploadService {
  constructor(
  ) {
  }

  getOrientedImage(image: HTMLImageElement, callback: Function) {
    Exif.getData(image, function () {
      let orientation = Exif.getTag(image, "Orientation");

      let img = this.getOrientedImageFromOrientationNumber(image, orientation);

      callback(img);
    });
  }

  getOrientedImageFromOrientationNumber (imageFile, orientationNumber){
    let img: any;
    let image = new Image();
    image.src = imageFile.src;
    image.width = imageFile.width;
    image.height = imageFile.height;
    debugger;

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

  // getOrientation(file, callback) {
  //   var reader = new FileReader();
  //   reader.onload = function(e) { debugger;
  //
  //     var view = new DataView(e.target.result);
  //     if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
  //     var length = view.byteLength, offset = 2;
  //     while (offset < length) {
  //       var marker = view.getUint16(offset, false);
  //       offset += 2;
  //       if (marker == 0xFFE1) {
  //         if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
  //         var little = view.getUint16(offset += 6, false) == 0x4949;
  //         offset += view.getUint32(offset + 4, little);
  //         var tags = view.getUint16(offset, little);
  //         offset += 2;
  //         for (var i = 0; i < tags; i++)
  //           if (view.getUint16(offset + (i * 12), little) == 0x0112)
  //             return callback(view.getUint16(offset + (i * 12) + 8, little));
  //       }
  //       else if ((marker & 0xFF00) != 0xFF00) break;
  //       else offset += view.getUint16(offset, false);
  //     }
  //     return callback(-1);
  //   };
  //   reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  // }

  getOrientation(file){
    let buffer = Exif.base64ToArrayBuffer(file);
    console.log(Exif.findEXIFinJPEG(buffer));
    let orientationNum = Exif.findEXIFinJPEG(buffer) ? Exif.findEXIFinJPEG(buffer)['Orientation'] : null;
    return orientationNum;
  }

  getImageFromBase64(file){
    let exif = Exif.findEXIFinJPEG(Exif.base64ToArrayBuffer(file));
    let image = {
      src: file,
      width: exif.PixelXDimension,
      height: exif.PixelYDimension
    };
    return image;
  }
  
  getOrientedImg(file){
    return this.getOrientedImageFromOrientationNumber(this.getImageFromBase64(file), this.getOrientation(file));
  }
  
}
