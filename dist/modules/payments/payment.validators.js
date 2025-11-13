"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSchema = exports.createPaymentSchema = exports.listPaymentsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.listPaymentsSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional(),
    pageSize: joi_1.default.number().integer().min(1).max(100).optional(),
    status: joi_1.default.string().valid('requested', 'approved', 'paid', 'declined').optional(),
    userId: joi_1.default.number().integer().min(1).optional(),
});
exports.createPaymentSchema = joi_1.default.object({
    userId: joi_1.default.number().integer().required(),
    amount: joi_1.default.number().precision(2).min(0).required(),
    adminRemarks: joi_1.default.string().allow(null, '').optional(),
});
exports.updatePaymentSchema = joi_1.default.object({
    status: joi_1.default.string().valid('approved', 'paid', 'declined').required(),
    paymentDate: joi_1.default.date().iso().optional().allow(null),
    transactionRef: joi_1.default.string().max(120).optional().allow(null, ''),
    adminRemarks: joi_1.default.string().optional().allow(null, ''),
});
//# sourceMappingURL=payment.validators.js.map