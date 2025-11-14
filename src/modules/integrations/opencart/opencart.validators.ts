import Joi from 'joi';

export const orderPayloadSchema = Joi.object({
  orderId: Joi.number().integer().required(),
  affiliateId: Joi.number().integer().required(),
  affiliateLinkId: Joi.number().integer().optional(),
  status: Joi.string().valid('pending', 'confirmed', 'returned').required(),
  totalAmount: Joi.number().precision(2).min(0).required(),
  orderDate: Joi.date().iso().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().precision(2).min(0).required(),
      }),
    )
    .min(1)
    .required(),
});

export const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'returned').required(),
  confirmationDate: Joi.date().iso().optional().allow(null),
});

export const programStatusSchema = Joi.object({
  timestamp: Joi.number().integer().optional(),
}).unknown(true);

export const linkLookupSchema = Joi.object({
  linkId: Joi.number().integer().required(),
}).unknown(true);

export const visitPayloadSchema = Joi.object({
  linkId: Joi.number().integer().required(),
  url: Joi.string().uri().optional(),
  userAgent: Joi.string().optional(),
  ipAddress: Joi.string().optional(),
}).unknown(true);

