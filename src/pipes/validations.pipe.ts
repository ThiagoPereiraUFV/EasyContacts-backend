import {
  PipeTransform,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'bson';
import { ObjectSchema } from 'joi';
import { ContactsService } from 'src/api/contacts/contacts.service';
import { UsersService } from '../api/users/users.service';

@Injectable()
export class EntityExistsValidationPipe implements PipeTransform {
  constructor(private service: UsersService | ContactsService) {}

  async transform(id: string) {
    try {
      new ObjectId(id);
    } catch (err) {
      throw new BadRequestException('Invalid param id');
    }

    const entity = await this.service.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Entity does not exist');
    }

    return id;
  }
}

@Injectable()
export class EmailExistsValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any) {
    if (!value.email) {
      return value;
    }

    const user = await this.usersService.findOne({
      where: { email: value.email },
    });

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    return value;
  }
}

@Injectable()
export class UserExistsValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any) {
    if (!value.userId) {
      return value;
    }

    try {
      new ObjectId(value.userId);
    } catch (err) {
      throw new BadRequestException('Invalid user id');
    }

    const user = await this.usersService.findOne({
      where: { id: value.userId },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    return value;
  }
}

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);

    if (error) {
      throw new BadRequestException(
        `Validation failed: ${error.details.slice(-1).pop().message}`,
      );
    }

    return value;
  }
}
