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
  EntityExistsValidationPipe,
  JoiValidationPipe,
} from 'src/pipes/validations.pipe';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { createContactSchema } from './schemas/create-contact.schema';
import { updateContactSchema } from './schemas/update-contact.schema';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(createContactSchema))
    createContactDto: CreateContactDto,
  ) {
    return await this.contactsService.create({
      data: createContactDto,
      include: { user: true },
    });
  }

  @Get()
  async findAll() {
    return await this.contactsService.findAll({ include: { user: true } });
  }

  @Get(':id')
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
  async update(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
    @Body(new JoiValidationPipe(updateContactSchema))
    updateContactDto: UpdateContactDto,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: updateContactDto,
      include: { user: true },
    });
  }

  @Put(':id')
  async replace(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
    @Body(new JoiValidationPipe(createContactSchema))
    replaceContactDto: UpdateContactDto,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: replaceContactDto,
      include: { user: true },
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', new EntityExistsValidationPipe(new ContactsService()))
    id: string,
  ) {
    return await this.contactsService.remove({
      where: { id },
      include: { user: true },
    });
  }
}
