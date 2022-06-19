import * as faker from 'faker-br';
import { CreateContactDto } from '../dto/create-contact.dto';
import { mockUser } from '../../users/utils/users.mock';

function mockContact(userId: string) {
  const contact: CreateContactDto = {
    name: faker.name.findName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    userId,
  };

  return contact;
}

export { mockContact, mockUser };
