import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UsePipes,
} from '@nestjs/common';
import {
  EmailExistsValidationPipe,
  JoiValidationPipe,
  ValidationIdPipe,
} from 'src/pipes/validations.pipe';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserSchema } from './schemas/create-user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema), EmailExistsValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create({ data: createUserDto });
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ValidationIdPipe) id: string) {
    return await this.usersService.findOne({ where: { id } });
  }

  @Patch(':id')
  async update(
    @Param('id', ValidationIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update({
      where: { id },
      data: updateUserDto,
    });
  }

  @Put(':id')
  async replace(
    @Param('id', ValidationIdPipe) id: string,
    @Body() replaceUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update({
      where: { id },
      data: replaceUserDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id', ValidationIdPipe) id: string) {
    return await this.usersService.remove({ where: { id } });
  }
}
