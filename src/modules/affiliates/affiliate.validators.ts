import Joi from 'joi';

export const createAffiliateSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  mobileNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
  role: Joi.string().valid('affiliate', 'admin').optional(),
  channelLink: Joi.string().uri().optional().allow(null, ''),
  appLink: Joi.string().uri().optional().allow(null, ''),
  websiteLink: Joi.string().uri().optional().allow(null, ''),
});

export const updateAffiliateSchema = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  channelLink: Joi.string().uri().optional().allow(null, ''),
  appLink: Joi.string().uri().optional().allow(null, ''),
  websiteLink: Joi.string().uri().optional().allow(null, ''),
  status: Joi.string().valid('pending', 'active', 'suspended').optional(),
}).min(1);

export const listAffiliatesSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid('pending', 'active', 'suspended').optional(),
  search: Joi.string().optional(),
});

