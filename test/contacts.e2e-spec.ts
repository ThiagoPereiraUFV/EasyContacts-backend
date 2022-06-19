import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ContactsModule } from './../src/api/contacts/contacts.module';
import { mockContact, mockUser } from '../src/api/contacts/utils/contacts.mock';
import { UsersModule } from '../src/api/users/users.module';

jest.setTimeout(30000);

describe('ContactsController (e2e)', () => {
  let app: INestApplication;
  const user = mockUser();
  const contacts = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, ContactsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) 200', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(user);
        Object.assign(user, req.body);
        for (let i = 0; i < 2; i++) {
          contacts.push(mockContact(user.id));
        }
      });
  });

  it('/contacts (POST) 200', () => {
    return request(app.getHttpServer())
      .post('/contacts')
      .send(contacts[0])
      .expect(201)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(contacts[0]);
        Object.assign(contacts[0], req.body);
      });
  });

  it('/contacts/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/contacts/${contacts[0].id}`)
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(contacts[0]);
      });
  });

  it('/contacts (GET)', () => {
    return request(app.getHttpServer())
      .get('/contacts')
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Array);
      });
  });

  it('/contacts/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/contacts/${contacts[0].id}`)
      .send(contacts[1])
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });

  it('/contacts/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/contacts/${contacts[0].id}`)
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });
});
