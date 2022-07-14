import * as Joi from 'joi';
import { UpdateUserDto } from '../dto/update-user.dto';

const schema = {
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatar: Joi.string().uri(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
};

const updateUserSchema = Joi.object<UpdateUserDto, true>(schema);

export { updateUserSchema };
