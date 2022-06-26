import { User } from '@prisma/client';
import { IContact } from '../../contacts/entities/contact.entity';

export interface IUser extends User {
  contacts?: IContact[] | undefined;
}
