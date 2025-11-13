import Joi from 'joi';

export const listPaymentsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid('requested', 'approved', 'paid', 'declined').optional(),
  userId: Joi.number().integer().min(1).optional(),
});

export const createPaymentSchema = Joi.object({
  userId: Joi.number().integer().required(),
  amount: Joi.number().precision(2).min(0).required(),
  adminRemarks: Joi.string().allow(null, '').optional(),
});

export const updatePaymentSchema = Joi.object({
  status: Joi.string().valid('approved', 'paid', 'declined').required(),
  paymentDate: Joi.date().iso().optional().allow(null),
  transactionRef: Joi.string().max(120).optional().allow(null, ''),
  adminRemarks: Joi.string().optional().allow(null, ''),
});

