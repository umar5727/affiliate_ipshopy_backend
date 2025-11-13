import Joi from 'joi';

export const listOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).max(100).optional(),
  userId: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid('pending', 'confirmed', 'returned').optional(),
});

export const recordOrderSchema = Joi.object({
  orderIdOpencart: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
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

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'returned').required(),
});

