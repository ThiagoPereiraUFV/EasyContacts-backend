import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) 401', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({})
      .expect(401);
  });

  it('/auth/register (POST) 400', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({})
      .expect(400);
  });

  it('/auth/updateme (POST) 401', () => {
    return request(app.getHttpServer())
      .patch('/auth/updateme')
      .send({})
      .expect(401);
  });

  it('/auth/me (GET) 401', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });
});
