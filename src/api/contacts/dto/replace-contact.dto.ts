import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';

export class ReplaceContactDto extends PartialType(CreateContactDto) {}
