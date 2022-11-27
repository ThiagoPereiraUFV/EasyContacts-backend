import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { IContact } from './entities/contact.entity';
import { mockContact, mockUser } from './utils/contacts.mock';

describe('ContactsController', () => {
  let controller: ContactsController;
  let usersService: UsersService;
  let user: IUser;
  const contacts: CreateContactDto[] = [];
  const createdContacts: IContact[] = [];

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
      createdContacts.push(result);
    }

    user.contacts = createdContacts;
  });

  it('ContactsController should return an array of contacts', async () => {
    const result = await controller.findAll();
    expect(result).toBeDefined();
  });

  it('ContactsController should return a contact', async () => {
    const result = await controller.findOne(createdContacts[0].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(createdContacts[0]);
  });

  it('ContactsController should return a second contact', async () => {
    const result = await controller.findOne(createdContacts[1].id);
    expect(result).toBeDefined();
    expect(result).toMatchObject(createdContacts[1]);
  });

  it('ContactsController should update a contact', async () => {
    const result = await controller.update(createdContacts[0].id, {
      name: contacts[1].name,
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: contacts[1].name });
  });

  it('ContactsController should replace a contact', async () => {
    const result = await controller.replace(createdContacts[0].id, {
      name: contacts[0].name,
      surname: contacts[1].surname,
      userId: user.id,
    });
    expect(result).toBeDefined();
    expect(result).toMatchObject({
      name: contacts[0].name,
      surname: contacts[1].surname,
      userId: user.id,
    });
  });

  it('ContactsController should delete contacts', async () => {
    for (const contact of createdContacts) {
      const result = await controller.remove(contact.id);
      expect(result).toBeDefined();
    }

    createdContacts.length = 0;
  });

  it('ContactsController should create an array of mine contacts', async () => {
    for (const contact of contacts) {
      const result = await controller.createMine(contact, user);
      expect(result).toBeDefined();
      expect(result).toMatchObject(contact);
      createdContacts.push(result);
    }

    user.contacts = createdContacts;
  });

  it('ContactsController should get mine', async () => {
    const result = await controller.mine(user);
    expect(result).toBeDefined();
    expect(result).toMatchObject(createdContacts);
  });

  it('ContactsController should update mine contact', async () => {
    const result = await controller.updateMine(
      createdContacts[0].id,
      {
        name: contacts[1].name,
      },
      user,
    );
    expect(result).toBeDefined();
    expect(result).toMatchObject({ name: contacts[1].name });
  });

  it('ContactsController should replace mine contact', async () => {
    const result = await controller.replaceMine(
      createdContacts[0].id,
      {
        name: contacts[0].name,
        surname: contacts[1].surname,
        userId: user.id,
      },
      user,
    );
    expect(result).toBeDefined();
    expect(result).toMatchObject({
      name: contacts[0].name,
      surname: contacts[1].surname,
      userId: user.id,
    });
  });

  it('ContactsController should delete contacts', async () => {
    for (const contact of createdContacts) {
      const result = await controller.removeMine(contact.id);
      expect(result).toBeDefined();
    }

    createdContacts.length = 0;
  });
});
