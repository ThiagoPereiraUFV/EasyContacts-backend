import * as Joi from 'joi';
import { CreateUserDto } from '../dto/create-user.dto';

const schema = {
  id: Joi.string().hex().length(24).optional(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().uri(),
  contacts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  createdAt: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date())
    .optional(),
  updatedAt: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date())
    .optional(),
};

const createUserSchema = Joi.object<CreateUserDto, true>(schema);

export { createUserSchema };
