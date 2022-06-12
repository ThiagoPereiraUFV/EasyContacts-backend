import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DBService } from 'src/db';

@Injectable()
export class UsersService {
  repository = new DBService().user;

  async create(createUserDto: CreateUserDto) {
    return this.repository.create({ data: createUserDto });
  }

  async findAll() {
    return this.repository.findMany();
  }

  async findOne(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.repository.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
