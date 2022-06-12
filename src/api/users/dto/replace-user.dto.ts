import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class ReplaceUserDto extends PartialType(CreateUserDto) {}
