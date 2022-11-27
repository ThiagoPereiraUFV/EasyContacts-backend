import * as Joi from 'joi';
import { CreateContactDto } from '../dto/create-contact.dto';

const schema = {
  id: Joi.string().hex().length(24).optional(),
  name: Joi.string().required(),
  surname: Joi.string().required(),
  userId: Joi.string().hex().length(24).optional(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  annotations: Joi.string(),
  avatar: Joi.string().uri(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
};

const createContactSchema = Joi.object<CreateContactDto, true>(schema);

export { createContactSchema };
