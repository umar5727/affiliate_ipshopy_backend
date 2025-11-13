import Joi from 'joi';

export const requestOtpSchema = Joi.object({
  mobileNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
  
});

export const verifyOtpSchema = Joi.object({
  mobileNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
  otp: Joi.string().length(6).required(),
  name: Joi.string().min(2).max(120).optional(),
  channelLink: Joi.string().uri().optional().allow(null, ''),
  appLink: Joi.string().uri().optional().allow(null, ''),
  websiteLink: Joi.string().uri().optional().allow(null, ''),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

