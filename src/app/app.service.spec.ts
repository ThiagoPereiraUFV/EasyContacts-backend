import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('AppService should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`AppService should return "App is running on port ${
    process.env.PORT || 4000
  } on ${process.env.NODE_ENV} mode"`, () => {
    expect(service.getRunningMessage()).toBe(
      `App is running on port ${process.env.PORT || 4000} on ${
        process.env.NODE_ENV
      } mode`,
    );
  });
});
