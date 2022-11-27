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

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(createContactSchema), UserExistsValidationPipe)
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

  @Get('mine')
  async mine(@User() user: IUser) {
    return user.contacts;
  }

  @Patch('mine/:id')
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
