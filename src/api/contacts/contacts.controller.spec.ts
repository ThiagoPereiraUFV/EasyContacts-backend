import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

describe('ContactsController', () => {
  let controller: ContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [ContactsService, UsersService],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
  });

  it('ContactsController should be defined', () => {
    expect(controller).toBeDefined();
  });
});
