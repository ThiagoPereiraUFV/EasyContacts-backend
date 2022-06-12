import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { DBService } from 'src/db';

@Injectable()
export class ContactsService {
  repository = new DBService().contact;

  async create(createContactDto: CreateContactDto) {
    return this.repository.create({ data: createContactDto });
  }

  async findAll() {
    return this.repository.findMany();
  }

  async findOne(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    return this.repository.update({ where: { id }, data: updateContactDto });
  }

  async remove(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
