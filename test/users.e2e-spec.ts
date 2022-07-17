import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './../src/api/users/users.module';
import { mockUser } from '../src/api/users/utils/users.mock';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/api/users/users.service';
import { IUser } from '../src/api/users/entities/user.entity';

jest.setTimeout(30000);

describe('UsersController (e2e)', () => {
  let usersService: UsersService;
  let app: INestApplication;
  let authuser: IUser;
  let jwt: string;
  const users = [mockUser(), mockUser(), mockUser()];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    authuser = await usersService.create({ data: users[0] });

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await usersService.remove({ where: { id: authuser.id } });
  });

  it('/auth/login (POST) 201', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authuser.email,
        password: users[0].password,
      })
      .expect(201)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body.user).toBeDefined();
        expect(req.body.user).toBeInstanceOf(Object);
        expect(req.body.jwt).toBeDefined();
        authuser = req.body.user;
        jwt = req.body.jwt;
      });
  });

  it('/users (POST) 200', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set({ Authorization: `Bearer ${jwt}` })
      .send(users[1])
      .expect(201)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        // expect(req.body).toMatchObject(users[1]);
        Object.assign(users[1], req.body);
      });
  });

  it('/users (POST) 400', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set({ Authorization: `Bearer ${jwt}` })
      .send(users[1])
      .expect(400);
  });

  it('/users/:id (GET) 200', () => {
    return request(app.getHttpServer())
      .get(`/users/${users[1].id}`)
      .set({ Authorization: `Bearer ${jwt}` })
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(users[1]);
      });
  });

  it('/users (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set({ Authorization: `Bearer ${jwt}` })
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Array);
      });
  });

  it('/users/:id (PATCH) 200', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[1].id}`)
      .set({ Authorization: `Bearer ${jwt}` })
      .send(users[2])
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });

  it('/users/:id (DELETE) 200', () => {
    return request(app.getHttpServer())
      .delete(`/users/${users[1].id}`)
      .set({ Authorization: `Bearer ${jwt}` })
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });
});
