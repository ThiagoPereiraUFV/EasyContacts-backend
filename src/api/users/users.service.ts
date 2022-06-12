import { Injectable } from '@nestjs/common';
import {
  CreateUserInterface,
  FindOneUserInterface,
  FindUserInterface,
  UpdateUserInterface,
  RemoveUserInterface,
} from './interfaces/crud.users';
import { DBService } from '../../db';

@Injectable()
export class UsersService {
  repository = new DBService().user;

  async create(params: CreateUserInterface) {
    return this.repository.create(params);
  }

  async findAll(params?: FindUserInterface) {
    return this.repository.findMany(params);
  }

  async findOne(params: FindOneUserInterface) {
    return this.repository.findUnique(params);
  }

  async update(params: UpdateUserInterface) {
    return this.repository.update(params);
  }

  async remove(params: RemoveUserInterface) {
    return this.repository.delete(params);
  }
}
