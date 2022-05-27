import * as Joi from 'joi';

export const ValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.string().required(),
  SWAGGER_ADMIN: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
});
