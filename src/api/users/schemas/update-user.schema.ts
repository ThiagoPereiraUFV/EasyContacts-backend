import * as Joi from 'joi';

const schema = {
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatar: Joi.string().uri(),
};

const updateUserSchema = Joi.object(schema);

export { updateUserSchema };
