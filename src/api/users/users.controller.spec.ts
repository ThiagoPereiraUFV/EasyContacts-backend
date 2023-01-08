import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockUser } from './utils/users.mock';

describe('UsersController', () => {
  let controller: UsersController;
  const users = [mockUser(), mockUser()];
  const createdUsers: IUser[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('UsersController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('UsersController should create an array of users', async () => {
    for (const user of users) {
      const result = await controller.create(user);
      expect(result).toBeDefined();
      // expect(result).toMatchObject(user);
      createdUsers.push(result);
    }
  });

  it('UsersController should return an array of users', async () => {
    const result = await controller.findAll();
    expect(result).toBeDefined();
  });

  it('UsersController should return a user', async () => {
    const result = await controller.findOne(createdUsers[0].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(createdUsers[0]);
  });

  it('UsersController should return a second user', async () => {
    const result = await controller.findOne(createdUsers[1].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(createdUsers[1]);
  });

  it('UsersController should update a user', async () => {
    const result = await controller.update(createdUsers[0].id, {
      name: users[1].name,
      password: users[1].password,
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: users[1].name });
  });

  it('UsersController should update a user', async () => {
    const result = await controller.replace(createdUsers[0].id, {
      name: users[0].name,
      email: users[0].email,
      password: users[0].password,
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({
      name: users[0].name,
      email: users[0].email,
    });
  });

  it('UsersController should delete users', async () => {
    for (const user of createdUsers) {
      const result = await controller.remove(user.id);
      expect(result).toBeDefined();
    }
  });
});
