import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../api/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { mockUser } from '../api/users/utils/users.mock';
import { jwt } from './jwt';
import { UsersService } from '../api/users/users.service';
import { IUser } from '../api/users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let user: IUser;
  let plainPassword: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: jwt.secret,
          signOptions: { expiresIn: jwt.expiresIn },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    const mockedUser = mockUser();
    plainPassword = mockedUser.password;
    user = await usersService.create({ data: mockedUser });
  });

  afterAll(async () => {
    await usersService.remove({ where: { id: user.id } });
  });

  it('AuthService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('AuthService should return user', async () => {
    const result = await service.validateUser(user.email, plainPassword);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Object);
  });

  it('AuthService should return null', async () => {
    const result = await service.validateUser('', '');
    expect(result).toBeNull();
  });

  it('AuthService should login user', async () => {
    const result = await service.login(user);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Object);
    expect(result.user).toBeDefined();
    expect(result.user).toBeInstanceOf(Object);
    expect(result.jwt).toBeDefined();
  });
});
