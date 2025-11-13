import Joi from 'joi';

export const createLinkSchema = Joi.object({
  productId: Joi.number().integer().positive().optional(),
  url: Joi.string().uri().required(),
  source: Joi.string().max(120).optional().allow(null, ''),
  name: Joi.string().min(2).max(120).optional(),
  channelLink: Joi.string().uri().optional(),
  appLink: Joi.string().uri().optional(),
  websiteLink: Joi.string().uri().optional(),
});

export const listLinksSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).max(100).optional(),
  userId: Joi.number().integer().min(1).optional(),
});

export const updateLinkStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  adminRemarks: Joi.string().max(255).allow(null, '').optional(),
});

