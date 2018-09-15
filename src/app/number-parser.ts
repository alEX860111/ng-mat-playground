import { Injectable } from '@angular/core';

@Injectable()
export class NumberParser {

  public parseNumber(value: string): number {
    if (!value) {
      return null;
    }

    value = value.replace(/[^\.\,\d]/g, '');
    value = value.replace(/\./g, '');
    var nth = 0;
    value = value.replace(/,/g, match => {
      nth++;
      return (nth === 1) ? match : '';
    });
    value = value.replace(/\,/g, '.');

    console.log('input', value);

    if (value.endsWith('.') || value.endsWith('.0')) {
      return null;
    }

    if (value.indexOf('.') === -1 && value.length > 0) {
      return Number(value);
    }

    const matches = value.match(/(\d+\.\d{1,2})/);
    if (matches && matches[0]) {
      return Number(matches[0]);
    }

    return null;
  }

}