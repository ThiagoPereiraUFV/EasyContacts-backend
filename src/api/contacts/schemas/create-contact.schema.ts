import * as Joi from 'joi';

const schema = {
  name: Joi.string().required(),
  surname: Joi.string().required(),
  userId: Joi.string().hex().length(24).required(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  annotations: Joi.string(),
  avatar: Joi.string().uri(),
};

const createContactSchema = Joi.object(schema);

export { createContactSchema };
