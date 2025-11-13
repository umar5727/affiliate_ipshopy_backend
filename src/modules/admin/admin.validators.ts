import Joi from 'joi';

export const requestOtpSchema = Joi.object({
  mobileNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
});

export const verifyOtpSchema = Joi.object({
  mobileNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
  otp: Joi.string().length(6).required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

