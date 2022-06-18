import * as Joi from 'joi';

const schema = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().uri(),
};

const createUserSchema = Joi.object(schema);

export { createUserSchema };
