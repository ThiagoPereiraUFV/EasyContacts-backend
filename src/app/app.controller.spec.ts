import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../api/users/users.service';
import { AppController } from './app.controller';
import { mockUser } from '../api/users/utils/users.mock';
import { IUser } from '../api/users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AppService } from './app.service';
import { Request } from 'express';

describe('AppController', () => {
  let controller: AppController;
  let usersService: UsersService;
  let user: IUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [AppController],
      providers: [AppService, UsersService],
    }).compile();

    controller = module.get<AppController>(AppController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await usersService.remove({ where: { id: user.id } });
  });

  it('AppController should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('AppController should return a message', async () => {
  //   const result = controller.index({} as Response);
  //   expect(result).toBeDefined();
  // });

  it('AppController should register user', async () => {
    const result = (user = await controller.register(mockUser()));
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });

  it('AppController should login user', async () => {
    const result = await controller.login({ user } as Request);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Object);
    expect(result.user).toBeDefined();
    expect(result.user).toBeInstanceOf(Object);
    expect(result.jwt).toBeDefined();
  });

  it('AppController should get me', async () => {
    const result = await controller.me({ user } as Request);
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });
});
