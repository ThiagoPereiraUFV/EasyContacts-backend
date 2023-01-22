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
  EntityExistsValidationPipe,
  JoiValidationPipe,
  UserExistsValidationPipe,
} from '../../pipes/validations.pipe';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { createContactSchema } from './schemas/create-contact.schema';
import { updateContactSchema } from './schemas/update-contact.schema';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { IUser } from '../users/entities/user.entity';
import { User } from '../../decorators/user.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('contacts')
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ description: 'Create a new contact' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async create(
    @Body(new JoiValidationPipe(createContactSchema), UserExistsValidationPipe)
    createContactDto: CreateContactDto,
  ) {
    return await this.contactsService.create({
      data: createContactDto,
      include: { user: true },
    });
  }

  @Get('mine')
  @ApiOperation({ description: 'Get all my contacts' })
  @ApiOkResponse({
    description: 'The records has been successfully fetched.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async mine(@User() user: IUser) {
    return user.contacts;
  }

  @Get()
  @ApiOperation({ description: 'Get all contacts' })
  @ApiOkResponse({
    description: 'The records has been successfully fetched.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async findAll() {
    return await this.contactsService.findAll({ include: { user: true } });
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a contact by id' })
  @ApiOkResponse({
    description: 'The record has been successfully fetched.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async findOne(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
  ) {
    return await this.contactsService.findOne({
      where: { id },
      include: { user: true },
    });
  }

  @Patch(':id')
  @ApiOperation({ description: 'Partially update a contact by id' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async update(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
    @Body(new JoiValidationPipe(updateContactSchema), UserExistsValidationPipe)
    updateContactDto: UpdateContactDto,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: updateContactDto,
      include: { user: true },
    });
  }

  @Put(':id')
  @ApiOperation({ description: 'Update a contact by id' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async replace(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
    @Body(new JoiValidationPipe(createContactSchema), UserExistsValidationPipe)
    replaceContactDto: CreateContactDto,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: replaceContactDto,
      include: { user: true },
    });
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a contact by id' })
  @ApiOkResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async remove(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
  ) {
    return await this.contactsService.remove({
      where: { id },
      include: { user: true },
    });
  }

  @Post('mine')
  @ApiOperation({ description: 'Create a new contact to me' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async createMine(
    @Body(new JoiValidationPipe(createContactSchema), UserExistsValidationPipe)
    createContactDto: CreateContactDto,
    @User() user: IUser,
  ) {
    return await this.contactsService.create({
      data: { ...createContactDto, userId: user.id },
      include: { user: true },
    });
  }

  @Patch('mine/:id')
  @ApiOperation({ description: 'Partially update my contact by id' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async updateMine(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
    @Body(new JoiValidationPipe(updateContactSchema), UserExistsValidationPipe)
    updateContactDto: UpdateContactDto,
    @User() user: IUser,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: { ...updateContactDto, userId: user.id },
      include: { user: true },
    });
  }

  @Put('mine/:id')
  @ApiOperation({ description: 'Update my contact by id' })
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async replaceMine(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
    @Body(new JoiValidationPipe(updateContactSchema), UserExistsValidationPipe)
    replaceContactDto: CreateContactDto,
    @User() user: IUser,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: { ...replaceContactDto, userId: user.id },
      include: { user: true },
    });
  }

  @Delete('mine/:id')
  @ApiOperation({ description: 'Delete my contact by id' })
  @ApiOkResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'The parameters are invalid.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  @ApiForbiddenResponse({ description: 'Forbidden path.' })
  async removeMine(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
  ) {
    return await this.contactsService.remove({
      where: { id },
      include: { user: true },
    });
  }
}
