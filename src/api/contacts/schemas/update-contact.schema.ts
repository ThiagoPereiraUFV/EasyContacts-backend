import * as Joi from 'joi';

const schema = {
  name: Joi.string(),
  surname: Joi.string(),
  user: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  annotations: Joi.string(),
  avatar: Joi.string().uri(),
};

const updateContactSchema = Joi.object(schema);

export { updateContactSchema };
