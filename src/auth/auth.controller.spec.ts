import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../api/users/users.service';
import { AuthController } from './auth.controller';
import { mockUser } from '../api/users/utils/users.mock';
import { IUser } from '../api/users/entities/user.entity';
import { AuthModule } from './auth.module';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let user: IUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [AuthController],
      providers: [UsersService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('AuthController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('AuthController should register user', async () => {
    const result = (user = await controller.register(mockUser()));
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });

  it('AuthController should login user', async () => {
    const result = await controller.login(user);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Object);
    expect(result.user).toBeDefined();
    expect(result.user).toBeInstanceOf(Object);
    expect(result.jwt).toBeDefined();
  });

  it('AuthController should update me', async () => {
    const result = (user = await controller.updateme(user, mockUser()));
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });

  it('AuthController should not update me', async () => {
    try {
      const badUser = { ...mockUser(), oldPassword: 'badpassword' };
      const result = await controller.updateme(user, badUser);
      expect(result).not.toBeDefined();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('AuthController should get me', async () => {
    const result = await controller.me(user);
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });

  it('AuthController should remove me', async () => {
    const result = await controller.removeme(user);
    expect(result).toBeDefined();
    expect(result).toMatchObject(user);
  });
});
