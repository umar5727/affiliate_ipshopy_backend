"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusUpdateSchema = exports.orderPayloadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.orderPayloadSchema = joi_1.default.object({
    orderId: joi_1.default.number().integer().required(),
    affiliateId: joi_1.default.number().integer().required(),
    affiliateLinkId: joi_1.default.number().integer().optional(),
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
exports.statusUpdateSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'confirmed', 'returned').required(),
    confirmationDate: joi_1.default.date().iso().optional().allow(null),
});
//# sourceMappingURL=opencart.validators.js.map