import { User } from '@prisma/client';
import { IContact } from 'src/api/contacts/entities/contact.entity';

export interface IUser extends User {
  contacts?: IContact[];
}
