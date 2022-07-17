import { Injectable } from '@nestjs/common';
import {
  CreateUserInterface,
  FindOneUserInterface,
  FindUserInterface,
  UpdateUserInterface,
  RemoveUserInterface,
} from './interfaces/crud.users';
import { DBService } from '../../db';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  repository = new DBService().user;

  async hashPassword(
    password: string | Prisma.StringFieldUpdateOperationsInput,
  ) {
    return await bcrypt.hash(String(password), 10);
  }

  async create(params: CreateUserInterface) {
    params.data.password = await this.hashPassword(params.data.password);

    return this.repository.create(params);
  }

  async findAll(params?: FindUserInterface) {
    return this.repository.findMany(params);
  }

  async findOne(params: FindOneUserInterface) {
    return this.repository.findUnique(params);
  }

  async update(params: UpdateUserInterface) {
    if (params.data.password) {
      params.data.password = await this.hashPassword(params.data.password);
    }

    return this.repository.update(params);
  }

  async remove(params: RemoveUserInterface) {
    return this.repository.delete(params);
  }

  async removeAll() {
    return this.repository.deleteMany();
  }
}
