import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './../src/api/users/users.module';
import { mockUser } from '../src/api/users/utils/users.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const users = [mockUser(), mockUser()];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) 200', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(users[0])
      .expect(201)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(users[0]);
        Object.assign(users[0], req.body);
      });
  });

  it('/users (POST) 400', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(users[0])
      .expect(400);
  });

  it('/users:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/users/${users[0].id}`)
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
        expect(req.body).toMatchObject(users[0]);
      });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Array);
      });
  });

  it('/users:id (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/users/${users[0].id}`)
      .send(users[1])
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });

  it('/users:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/users/${users[0].id}`)
      .expect(200)
      .expect((req) => {
        expect(req.body).toBeDefined();
        expect(req.body).toBeInstanceOf(Object);
      });
  });
});
