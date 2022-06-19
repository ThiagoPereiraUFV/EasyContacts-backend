import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ContactsService } from './contacts.service';
import { mockContact, mockUser } from './utils/contacts.mock';

describe('ContactsService', () => {
  let service: ContactsService;
  let usersService: UsersService;
  let user: User;
  const contacts = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactsService, UsersService],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    usersService = module.get<UsersService>(UsersService);

    user = await usersService.create({ data: mockUser() });

    for (let i = 0; i < 2; i++) {
      contacts.push(mockContact(user.id));
    }

    await service.removeAll();
  });

  afterAll(async () => {
    await usersService.removeAll();
  });

  it('ContactsService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create an array of contacts', async () => {
    for (const contact of contacts) {
      const result = await service.create({ data: contact });
      expect(result).toBeDefined();
      expect(result).toMatchObject(contact);
      Object.assign(contact, result);
    }
  });

  it('Should return an array of contacts', async () => {
    const result = await service.findAll();
    expect(result).toBeDefined();
    expect(result).toMatchObject(contacts);
    expect(result).toHaveLength(contacts.length);
  });

  it('Should return a contact', async () => {
    const result = await service.findOne({ where: { id: contacts[0].id } });
    expect(result).toBeDefined();
    expect(result).toMatchObject(contacts[0]);
  });

  it('Should return a second contact', async () => {
    const result = await service.findOne({ where: { id: contacts[1].id } });
    expect(result).toBeDefined();
    expect(result).toMatchObject(contacts[1]);
  });

  it('Should update a contact', async () => {
    const result = await service.update({
      where: { id: contacts[0].id },
      data: { name: contacts[1].name },
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: contacts[1].name });
  });

  it('Should delete contacts', async () => {
    for (const contact of contacts) {
      const result = await service.remove({ where: { id: contact.id } });
      expect(result).toBeDefined();
    }
  });
});
