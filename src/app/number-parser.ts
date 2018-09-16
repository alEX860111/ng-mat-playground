import { Injectable } from '@angular/core';

export interface NumberParseResult {
  value: number;
  numFractionDigits: number;
}

@Injectable()
export class NumberParser {

  public parseNumber(value: string, maxFractionDigits = 2): NumberParseResult {
    if (!value) {
      return null;
    }

    value = this.sanitize(value);

    if (value.endsWith('.')) {
      return null;
    }

    if (value.indexOf('.') === -1 && value.length > 0) {
      return { value: Number(value), numFractionDigits: 0 };
    }
    const matches = value.match(new RegExp(`(\\d+\\.(\\d{1,${maxFractionDigits}}))`));
    if (matches && matches[0]) {
      return { value: Number(matches[1]), numFractionDigits: Number(matches[2].length) };
    }

    return null;
  }

  private sanitize(value: string): string {
    value = value.replace(/[^\,\d]/g, '');

    var nth = 0;
    value = value.replace(/,/g, match => {
      nth++;
      return (nth === 1) ? match : '';
    });

    return value.replace(/\,/g, '.');
  }

}