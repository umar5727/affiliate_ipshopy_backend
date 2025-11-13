import Joi from 'joi';

export const updateSettingSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives(Joi.string(), Joi.number(), Joi.boolean()).required(),
  description: Joi.string().allow(null, '').optional(),
});

