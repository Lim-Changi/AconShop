import * as Joi from 'joi';

export const ValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.string().required(),
  SWAGGER_ADMIN: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  SYNCHRONIZE: Joi.string().required(),
  LOGGING: Joi.string().required(),
  DB_CONNECTION_TIMEOUT: Joi.string().required(),
});
