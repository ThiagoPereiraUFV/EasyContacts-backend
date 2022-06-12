import { Prisma } from '@prisma/client';

export interface CreateContactInterface extends Prisma.ContactCreateArgs {}

export interface FindContactInterface extends Prisma.ContactFindManyArgs {}

export interface FindOneContactInterface extends Prisma.ContactFindUniqueArgs {}

export interface RemoveContactInterface extends Prisma.ContactDeleteArgs {}

export interface UpdateContactInterface extends Prisma.ContactUpdateArgs {}
