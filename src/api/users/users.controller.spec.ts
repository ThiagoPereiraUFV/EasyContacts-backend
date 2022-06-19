import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockUser } from './utils/users.mock';

jest.setTimeout(10000);

describe('UsersController', () => {
  let controller: UsersController;
  const users = [mockUser(), mockUser()];

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

  it('Should create an array of users', async () => {
    for (const user of users) {
      const result = await controller.create(user);
      expect(result).toBeDefined();
      expect(result).toMatchObject(user);
      Object.assign(user, result);
    }
  });

  it('Should return an array of users', async () => {
    const result = await controller.findAll();
    expect(result).toBeDefined();
    // expect(result).toMatchObject(users);
    // expect(result).toHaveLength(users.length);
  });

  it('Should return a user', async () => {
    const result = await controller.findOne(users[0].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(users[0]);
  });

  it('Should return a second user', async () => {
    const result = await controller.findOne(users[1].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(users[1]);
  });

  it('Should update a user', async () => {
    const result = await controller.update(users[0].id, {
      name: users[1].name,
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: users[1].name });
  });

  it('Should delete users', async () => {
    for (const user of users) {
      const result = await controller.remove(user.id);
      expect(result).toBeDefined();
    }
  });
});
