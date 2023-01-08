import * as Joi from 'joi';
import { CreateContactDto } from '../dto/create-contact.dto';

const schema = {
  id: Joi.string().hex().length(24).optional(),
  name: Joi.string(),
  surname: Joi.string(),
  userId: Joi.string().hex().length(24),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  annotations: Joi.string(),
  avatar: Joi.string().uri(),
  createdAt: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date())
    .optional(),
  updatedAt: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date())
    .optional(),
};

const updateContactSchema = Joi.object<CreateContactDto, true>(schema);

export { updateContactSchema };
