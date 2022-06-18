import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, UsersService],
})
export class ContactsModule {}
