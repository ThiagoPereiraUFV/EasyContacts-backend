import { Prisma } from '@prisma/client';

export interface UpdateUserDto extends Prisma.UserUpdateWithoutContactsInput {}
