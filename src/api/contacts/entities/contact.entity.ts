import { Prisma, Contact } from '@prisma/client';

export interface IContact extends Contact, Prisma.ContactInclude {}
