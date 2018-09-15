import { NumberParser } from './number-parser';

describe('NumberParser', () => {

  let numberParser: NumberParser;

  beforeEach(() => {
    numberParser = new NumberParser();
  });

  it('should parse numbers', () => {
    expect(numberParser.parseNumber('')).toEqual(null);
    expect(numberParser.parseNumber(null)).toEqual(null);
    expect(numberParser.parseNumber(undefined)).toEqual(null);
    expect(numberParser.parseNumber('42')).toEqual(42);
    expect(numberParser.parseNumber('42,89')).toEqual(42.89);
    expect(numberParser.parseNumber('42,89,')).toEqual(42.89);
    expect(numberParser.parseNumber('42,8')).toEqual(42.8);
    expect(numberParser.parseNumber('42,899')).toEqual(42.89);
    expect(numberParser.parseNumber('1.000')).toEqual(1000);
    expect(numberParser.parseNumber('1.000,89')).toEqual(1000.89);
    expect(numberParser.parseNumber('42,')).toEqual(null);
    expect(numberParser.parseNumber('42,0')).toEqual(null);
    expect(numberParser.parseNumber('abc')).toEqual(null);
    expect(numberParser.parseNumber('abc42')).toEqual(42);
  });

});
