import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../api/users/users.service';
import { AuthController } from './auth.controller';
import { mockUser } from '../api/users/utils/users.mock';
import { IUser } from '../api/users/entities/user.entity';
import { AuthModule } from './auth.module';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: UsersService;
  let user: IUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [AuthController],
      providers: [UsersService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await usersService.remove({ where: { id: user.id } });
  });

  it('AuthController should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('AuthController should return a message', async () => {
  //   const result = controller.index({} as Response);
  //   expect(result).toBeDefined();
  // });

  it('AuthController should register user', async () => {
    const result = (user = await controller.register(mockUser()));
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });

  it('AuthController should login user', async () => {
    const result = await controller.login({ user } as Request);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Object);
    expect(result.user).toBeDefined();
    expect(result.user).toBeInstanceOf(Object);
    expect(result.jwt).toBeDefined();
  });

  it('AuthController should get me', async () => {
    const result = await controller.me({ user } as Request);
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });
});
