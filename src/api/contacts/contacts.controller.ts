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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return await this.contactsService.create({ data: createContactDto });
  }

  @Get()
  async findAll() {
    return await this.contactsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.contactsService.findOne({ where: { id } });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: updateContactDto,
    });
  }

  @Put(':id')
  async replace(
    @Param('id') id: string,
    @Body() replaceContactDto: UpdateContactDto,
  ) {
    return await this.contactsService.update({
      where: { id },
      data: replaceContactDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.contactsService.remove({ where: { id } });
  }
}
