import {Pipe, PipeTransform} from '@angular/core';
import {filter, includes} from 'lodash';

@Pipe({name: 'textFilter'})

export class TextFilterPipe implements PipeTransform {
  transform(items: any[], term: string, prop: string): any {
    if (!term) return items;
    return filter(items, item => includes(item[prop].toLowerCase(), term.toLowerCase()));
  }
}
