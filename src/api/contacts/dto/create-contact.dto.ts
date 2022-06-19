import { Prisma } from '@prisma/client';

export interface CreateContactDto extends Prisma.ContactCreateManyInput {}
