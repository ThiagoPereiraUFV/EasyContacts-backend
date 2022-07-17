import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from './entities/user.entity';
import { UsersService } from './users.service';
import { mockUser } from './utils/users.mock';

describe('UsersService', () => {
  let service: UsersService;
  const users = [mockUser(), mockUser()];
  const createdUsers: IUser[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('UsersService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('UsersService should create an array of users', async () => {
    for (const user of users) {
      const result = await service.create({ data: user });
      expect(result).toBeDefined();
      // expect(result).toMatchObject(user);
      createdUsers.push(result);
    }
  });

  it('UsersService should return an array of users', async () => {
    const result = await service.findAll();
    expect(result).toBeDefined();
  });

  it('UsersService should return a user', async () => {
    const result = await service.findOne({ where: { id: createdUsers[0].id } });
    expect(result).toBeDefined();
    expect(result).toMatchObject(createdUsers[0]);
  });

  it('UsersService should return a second user', async () => {
    const result = await service.findOne({ where: { id: createdUsers[1].id } });
    expect(result).toBeDefined();
    expect(result).toMatchObject(createdUsers[1]);
  });

  it('UsersService should update a user', async () => {
    const result = await service.update({
      where: { id: createdUsers[0].id },
      data: { name: users[1].name, password: users[1].password },
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: createdUsers[1].name });
  });

  it('UsersService should delete users', async () => {
    for (const user of createdUsers) {
      const result = await service.remove({ where: { id: user.id } });
      expect(result).toBeDefined();
    }
  });
});
