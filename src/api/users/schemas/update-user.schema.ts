import * as Joi from 'joi';
import { CreateUserDto } from '../dto/create-user.dto';

const schema = {
  id: Joi.string().hex().length(24).optional(),
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatar: Joi.string().uri(),
  createdAt: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date())
    .optional(),
  updatedAt: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date())
    .optional(),
};

const updateUserSchema = Joi.object<CreateUserDto, true>(schema);

export { updateUserSchema };
