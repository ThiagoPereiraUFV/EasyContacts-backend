import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'bson';
import { ObjectSchema } from 'joi';
import { UsersService } from '../api/users/users.service';

@Injectable()
export class ValidationIdPipe implements PipeTransform {
  transform(value: any) {
    try {
      new ObjectId(value);
    } catch (err) {
      throw new BadRequestException('Invalid param id');
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

@Injectable()
export class EmailExistsValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform({ email }: any) {
    const user = await this.usersService.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    return email;
  }
}
