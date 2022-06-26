import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { mockContact, mockUser } from './utils/contacts.mock';

describe('ContactsController', () => {
  let controller: ContactsController;
  let usersService: UsersService;
  let user: IUser;
  const contacts = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [ContactsService, UsersService],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    usersService = module.get<UsersService>(UsersService);

    user = await usersService.create({ data: mockUser() });

    for (let i = 0; i < 2; i++) {
      contacts.push(mockContact(user.id));
    }
  });

  afterAll(async () => {
    await usersService.remove({ where: { id: user.id } });
  });

  it('ContactsController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('ContactsController should create an array of contacts', async () => {
    for (const contact of contacts) {
      const result = await controller.create(contact);
      expect(result).toBeDefined();
      expect(result).toMatchObject(contact);
      Object.assign(contact, result);
    }
  });

  it('ContactsController should return an array of contacts', async () => {
    const result = await controller.findAll();
    expect(result).toBeDefined();
  });

  it('ContactsController should return a contact', async () => {
    const result = await controller.findOne(contacts[0].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(contacts[0]);
  });

  it('ContactsController should return a second contact', async () => {
    const result = await controller.findOne(contacts[1].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(contacts[1]);
  });

  it('ContactsController should update a contact', async () => {
    const result = await controller.update(contacts[0].id, {
      name: contacts[1].name,
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: contacts[1].name });
  });

  it('ContactsController should delete contacts', async () => {
    for (const contact of contacts) {
      const result = await controller.remove(contact.id);
      expect(result).toBeDefined();
    }
  });
});
