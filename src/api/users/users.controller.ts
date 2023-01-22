import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  EmailExistsValidationPipe,
  JoiValidationPipe,
  EntityExistsValidationPipe,
} from '../../pipes/validations.pipe';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserSchema } from './schemas/create-user.schema';
import { updateUserSchema } from './schemas/update-user.schema';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ description: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
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
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({
    description: 'The records has been successfully fetched.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async findAll() {
    return await this.usersService.findAll({ include: { contacts: true } });
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a user by id' })
  @ApiOkResponse({
    description: 'The record has been successfully fetched.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
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
  @ApiOperation({ description: 'Partially update a user by id' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
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
  @ApiOperation({ description: 'Update a user by id' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async replace(
    @Param('id', new EntityExistsValidationPipe(new UsersService()))
    id: string,
    @Body(new JoiValidationPipe(createUserSchema), EmailExistsValidationPipe)
    replaceUserDto: CreateUserDto,
  ) {
    return await this.usersService.update({
      where: { id },
      data: replaceUserDto,
      include: { contacts: true },
    });
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a user by id' })
  @ApiOkResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
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
