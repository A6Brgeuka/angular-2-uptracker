import { FrontendUptrackerPage } from './app.po';

describe('frontend-uptracker App', function() {
  let page: FrontendUptrackerPage;

  beforeEach(() => {
    page = new FrontendUptrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
