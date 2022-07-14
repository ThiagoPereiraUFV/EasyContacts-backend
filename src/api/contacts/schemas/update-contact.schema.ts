import * as Joi from 'joi';
import { UpdateContactDto } from '../dto/update-contact.dto';

const schema = {
  name: Joi.string(),
  surname: Joi.string(),
  userId: Joi.string().hex().length(24),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  annotations: Joi.string(),
  avatar: Joi.string().uri(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
};

const updateContactSchema = Joi.object<UpdateContactDto, true>(schema);

export { updateContactSchema };
