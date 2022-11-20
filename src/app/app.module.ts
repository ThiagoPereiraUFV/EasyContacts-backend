import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../api/users/users.module';
import { ContactsModule } from '../api/contacts/contacts.module';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, ContactsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}