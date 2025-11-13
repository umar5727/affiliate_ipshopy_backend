"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.recordOrderSchema = exports.listOrdersSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.listOrdersSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional(),
    pageSize: joi_1.default.number().integer().min(1).max(100).optional(),
    userId: joi_1.default.number().integer().min(1).optional(),
    status: joi_1.default.string().valid('pending', 'confirmed', 'returned').optional(),
});
exports.recordOrderSchema = joi_1.default.object({
    orderIdOpencart: joi_1.default.number().integer().required(),
    userId: joi_1.default.number().integer().required(),
    status: joi_1.default.string().valid('pending', 'confirmed', 'returned').required(),
    totalAmount: joi_1.default.number().precision(2).min(0).required(),
    orderDate: joi_1.default.date().iso().required(),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        productId: joi_1.default.number().integer().required(),
        quantity: joi_1.default.number().integer().min(1).required(),
        price: joi_1.default.number().precision(2).min(0).required(),
    }))
        .min(1)
        .required(),
});
exports.updateStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'confirmed', 'returned').required(),
});
//# sourceMappingURL=order.validators.js.map