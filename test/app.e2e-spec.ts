import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((req) => {
        expect(req.body.message).toBe(
          `App is running on port ${process.env.PORT || 4000} on ${
            process.env.NODE_ENV
          } mode`,
        );
      });
  });
});
