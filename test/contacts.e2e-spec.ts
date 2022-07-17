import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ContactsModule } from './../src/api/contacts/contacts.module';
import { mockContact, mockUser } from '../src/api/contacts/utils/contacts.mock';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/api/users/users.service';
import { IUser } from '../src/api/users/entities/user.entity';

jest.setTimeout(30000);

describe('ContactsController (e2e)', () => {
  let usersService: UsersService;
  let app: INestApplication;
  let authuser: IUser;
  let jwt: string;
  const user = mockUser();
  const contacts = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ContactsModule],
    }).compile();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    authuser = await usersService.create({ data: user });

    for (let i = 0; i < 2; i++) {
      contacts.push(mockContact(authuser.id));
    }

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
        password: user.password,
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

  it('/contacts (POST) 201', () => {
    return request(app.getHttpServer())
      .post('/contacts')
      .set({ Authorization: `Bearer ${jwt}` })
      .send(contacts[0])
      .expect(201)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(contacts[0]);
        Object.assign(contacts[0], req.body);
      });
  });

  it('/contacts/:id (GET) 200', () => {
    return request(app.getHttpServer())
      .get(`/contacts/${contacts[0].id}`)
      .set({ Authorization: `Bearer ${jwt}` })
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(contacts[0]);
      });
  });

  it('/contacts (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/contacts')
      .set({ Authorization: `Bearer ${jwt}` })
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Array);
      });
  });

  it('/contacts/:id (PATCH) 200', () => {
    return request(app.getHttpServer())
      .patch(`/contacts/${contacts[0].id}`)
      .set({ Authorization: `Bearer ${jwt}` })
      .send(contacts[1])
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });

  it('/contacts/:id (DELETE) 200', () => {
    return request(app.getHttpServer())
      .delete(`/contacts/${contacts[0].id}`)
      .set({ Authorization: `Bearer ${jwt}` })
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });
});
