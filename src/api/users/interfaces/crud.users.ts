import { Prisma } from '@prisma/client';

export interface CreateUserInterface extends Prisma.UserCreateArgs {}

export interface FindUserInterface extends Prisma.UserFindManyArgs {}

export interface FindOneUserInterface extends Prisma.UserFindUniqueArgs {}

export interface RemoveUserInterface extends Prisma.UserDeleteArgs {}

export interface UpdateUserInterface extends Prisma.UserUpdateArgs {}
