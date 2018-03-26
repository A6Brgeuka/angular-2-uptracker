import {Pipe, PipeTransform, Injectable} from '@angular/core';

@Pipe({name: 'orderByDate'})

@Injectable()
export class OrderByDatePipe implements PipeTransform {
  transform(array: Array<any>, date: string): Array<any> {
    if (typeof date === "undefined") {
      return array;
    }
    let direction = date[0][0];
    let column = date.replace('-','');
    array.sort((a: any, b: any) => {
      let left = Number(new Date(a[column]));
      let right = Number(new Date(b[column]));
      return (direction === "-") ? right - left : left - right;
    });
    return array;
  }
}
