import Joi from 'joi';

export const listCommissionsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid('pending', 'confirmed', 'returned').optional(),
  orderId: Joi.number().integer().min(1).optional(),
  userId: Joi.number().integer().min(1).optional(),
});

export const updateCommissionSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'returned').required(),
  confirmationDate: Joi.date().iso().optional().allow(null),
});

