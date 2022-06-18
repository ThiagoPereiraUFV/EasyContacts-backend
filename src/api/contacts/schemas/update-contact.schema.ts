import * as Joi from 'joi';

const schema = {
  name: Joi.string(),
  surname: Joi.string(),
  userId: Joi.string().hex().length(24),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  annotations: Joi.string(),
  avatar: Joi.string().uri(),
};

const updateContactSchema = Joi.object(schema);

export { updateContactSchema };
