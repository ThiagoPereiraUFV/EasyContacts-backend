import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  EmailExistsValidationPipe,
  JoiValidationPipe,
  EntityExistsValidationPipe,
} from 'src/pipes/validations.pipe';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserSchema } from './schemas/create-user.schema';
import { updateUserSchema } from './schemas/update-user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(createUserSchema), EmailExistsValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create({
      data: createUserDto,
      include: { contacts: true },
    });
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll({ include: { contacts: true } });
  }

  @Get(':id')
  async findOne(
    @Param('id', new EntityExistsValidationPipe(new UsersService()))
    id: string,
  ) {
    return await this.usersService.findOne({
      where: { id },
      include: { contacts: true },
    });
  }

  @Patch(':id')
  async update(
    @Param('id', new EntityExistsValidationPipe(new UsersService()))
    id: string,
    @Body(new JoiValidationPipe(updateUserSchema), EmailExistsValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update({
      where: { id },
      data: updateUserDto,
      include: { contacts: true },
    });
  }

  @Put(':id')
  async replace(
    @Param('id', new EntityExistsValidationPipe(new UsersService()))
    id: string,
    @Body(new JoiValidationPipe(createUserSchema), EmailExistsValidationPipe)
    replaceUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update({
      where: { id },
      data: replaceUserDto,
      include: { contacts: true },
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', new EntityExistsValidationPipe(new UsersService()))
    id: string,
  ) {
    return await this.usersService.remove({
      where: { id },
      include: { contacts: true },
    });
  }
}
