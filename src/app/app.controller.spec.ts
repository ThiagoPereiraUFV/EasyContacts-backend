import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('AppController should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('AppController should return a message', async () => {
  //   const result = controller.index({} as Response);
  //   expect(result).toBeDefined();
  // });
});
