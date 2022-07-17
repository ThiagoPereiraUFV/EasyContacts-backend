import { Prisma, User } from '@prisma/client';

export interface IUser extends User, Prisma.UserInclude {}
