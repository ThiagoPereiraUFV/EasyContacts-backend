import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../api/users/users.service';
import { AppController } from './app.controller';
import { mockUser } from '../api/users/utils/users.mock';
import { IUser } from '../api/users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AppService } from './app.service';

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

    user = await usersService.create({ data: mockUser() });
  });

  afterAll(async () => {
    await usersService.remove({ where: { id: user.id } });
  });

  it('AppController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('AppController should login user', async () => {
    const result = await controller.login({ user });
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Object);
    expect(result.user).toBeDefined();
    expect(result.user).toBeInstanceOf(Object);
    expect(result.jwt).toBeDefined();
  });
});
