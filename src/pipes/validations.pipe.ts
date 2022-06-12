import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'bson';

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
