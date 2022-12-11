import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../api/users/users.module';
import { ContactsModule } from '../api/contacts/contacts.module';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { AuthModule } from '../auth/auth.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import * as packageJson from '../../package.json';

@Module({
  imports: [
    UsersModule,
    ContactsModule,
    AuthModule,
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: process.env.NODE_ENV !== 'production',
      environment: process.env.NODE_ENV,
      release: packageJson.version,
      tracesSampleRate: 1.0,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
