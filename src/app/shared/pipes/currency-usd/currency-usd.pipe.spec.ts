import { CurrencyUsdPipe } from './currency-usd.pipe';

describe('CurrencyUsdPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyUsdPipe();
    expect(pipe).toBeTruthy();
  });
});
