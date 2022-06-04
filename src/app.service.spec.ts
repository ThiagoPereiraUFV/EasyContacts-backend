import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeAll(async () => {
    appService = new AppService();
  });

  it(`Should return "App is running on port ${
    process.env.PORT || 4000
  }"`, () => {
    expect(appService.getRunningMessage()).toBe(
      `App is running on port ${process.env.PORT || 4000}`,
    );
  });
});
