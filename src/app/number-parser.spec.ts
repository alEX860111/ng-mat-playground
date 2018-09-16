import { NumberParser } from './number-parser';

describe('NumberParser', () => {

  let numberParser: NumberParser;

  beforeEach(() => {
    numberParser = new NumberParser();
  });

  it('should return null if number cannot be parsed', () => {
    expect(numberParser.parseNumber('')).toEqual(null);
    expect(numberParser.parseNumber(null)).toEqual(null);
    expect(numberParser.parseNumber(undefined)).toEqual(null);
    expect(numberParser.parseNumber('42,')).toEqual(null);
    expect(numberParser.parseNumber('abc')).toEqual(null);
  });

  it('should return the parse result', () => {
    expect(numberParser.parseNumber('42')).toEqual({ value: 42, numFractionDigits: 0 });
    expect(numberParser.parseNumber('42,89')).toEqual({ value: 42.89, numFractionDigits: 2 });
    expect(numberParser.parseNumber('42,89,')).toEqual({ value: 42.89, numFractionDigits: 2 });
    expect(numberParser.parseNumber('42,8')).toEqual({ value: 42.8, numFractionDigits: 1 });
    expect(numberParser.parseNumber('42,899')).toEqual({ value: 42.89, numFractionDigits: 2 });
    expect(numberParser.parseNumber('1.000')).toEqual({ value: 1000, numFractionDigits: 0 });
    expect(numberParser.parseNumber('1.000,89')).toEqual({ value: 1000.89, numFractionDigits: 2 });
    expect(numberParser.parseNumber('42,0')).toEqual({ value: 42, numFractionDigits: 1 });
    expect(numberParser.parseNumber('abc42')).toEqual({ value: 42, numFractionDigits: 0 });
  });

});
