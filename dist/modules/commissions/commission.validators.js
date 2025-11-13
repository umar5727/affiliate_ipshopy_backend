"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommissionSchema = exports.listCommissionsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.listCommissionsSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional(),
    pageSize: joi_1.default.number().integer().min(1).max(100).optional(),
    status: joi_1.default.string().valid('pending', 'confirmed', 'returned').optional(),
    orderId: joi_1.default.number().integer().min(1).optional(),
    userId: joi_1.default.number().integer().min(1).optional(),
});
exports.updateCommissionSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'confirmed', 'returned').required(),
    confirmationDate: joi_1.default.date().iso().optional().allow(null),
});
//# sourceMappingURL=commission.validators.js.map