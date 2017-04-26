import { NgbloodPage } from './app.po';

describe('ngblood App', () => {
  let page: NgbloodPage;

  beforeEach(() => {
    page = new NgbloodPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
