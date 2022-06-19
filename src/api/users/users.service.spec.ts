import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { mockUser } from './utils/users.mock';

describe('UsersService', () => {
  let service: UsersService;
  const users = [mockUser(), mockUser()];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // await service.removeAll();
  });

  it('UsersService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create an array of users', async () => {
    for (const user of users) {
      const result = await service.create({ data: user });
      expect(result).toBeDefined();
      expect(result).toMatchObject(user);
      Object.assign(user, result);
    }
  });

  it('Should return an array of users', async () => {
    const result = await service.findAll();
    expect(result).toBeDefined();
    // expect(result).toMatchObject(users);
    // expect(result).toHaveLength(users.length);
  });

  it('Should return a user', async () => {
    const result = await service.findOne({ where: { id: users[0].id } });
    expect(result).toBeDefined();
    expect(result).toMatchObject(users[0]);
  });

  it('Should return a second user', async () => {
    const result = await service.findOne({ where: { id: users[1].id } });
    expect(result).toBeDefined();
    expect(result).toMatchObject(users[1]);
  });

  it('Should update a user', async () => {
    const result = await service.update({
      where: { id: users[0].id },
      data: { name: users[1].name },
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: users[1].name });
  });

  it('Should delete users', async () => {
    for (const user of users) {
      const result = await service.remove({ where: { id: user.id } });
      expect(result).toBeDefined();
    }
  });
});
