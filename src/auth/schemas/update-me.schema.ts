import * as Joi from 'joi';
import { UpdateUserDto } from 'src/api/users/dto/update-user.dto';
import { updateUserSchema } from '../../api/users/schemas/update-user.schema';

const schema = {
  oldPassword: Joi.string(),
} as UpdateUserDto;

const updateMeSchema = updateUserSchema.keys(schema);

export { updateMeSchema };
