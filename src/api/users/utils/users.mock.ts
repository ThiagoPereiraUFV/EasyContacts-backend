import * as faker from 'faker-br';
import { CreateUserDto } from '../dto/create-user.dto';

function mockUser() {
  const user: CreateUserDto = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return user;
}

export { mockUser };
