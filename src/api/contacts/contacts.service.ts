import { Injectable } from '@nestjs/common';
import {
  CreateContactInterface,
  FindOneContactInterface,
  FindContactInterface,
  UpdateContactInterface,
  RemoveContactInterface,
} from './interfaces/crud.contacts';
import { DBService } from '../../db';

@Injectable()
export class ContactsService {
  repository = new DBService().contact;

  async create(params: CreateContactInterface) {
    return this.repository.create(params);
  }

  async findAll(params?: FindContactInterface) {
    return this.repository.findMany(params);
  }

  async findOne(params: FindOneContactInterface) {
    return this.repository.findUnique(params);
  }

  async update(params: UpdateContactInterface) {
    return this.repository.update(params);
  }

  async remove(params: RemoveContactInterface) {
    return this.repository.delete(params);
  }

  async removeAll() {
    return this.repository.deleteMany();
  }
}
