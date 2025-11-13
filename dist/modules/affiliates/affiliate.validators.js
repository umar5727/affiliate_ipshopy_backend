"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAffiliatesSchema = exports.updateAffiliateSchema = exports.createAffiliateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAffiliateSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(120).required(),
    mobileNumber: joi_1.default.string().pattern(/^\d{10,15}$/).required(),
    role: joi_1.default.string().valid('affiliate', 'admin').optional(),
    channelLink: joi_1.default.string().uri().optional().allow(null, ''),
    appLink: joi_1.default.string().uri().optional().allow(null, ''),
    websiteLink: joi_1.default.string().uri().optional().allow(null, ''),
});
exports.updateAffiliateSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(120).optional(),
    channelLink: joi_1.default.string().uri().optional().allow(null, ''),
    appLink: joi_1.default.string().uri().optional().allow(null, ''),
    websiteLink: joi_1.default.string().uri().optional().allow(null, ''),
    status: joi_1.default.string().valid('pending', 'active', 'suspended').optional(),
}).min(1);
exports.listAffiliatesSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional(),
    pageSize: joi_1.default.number().integer().min(1).max(100).optional(),
    status: joi_1.default.string().valid('pending', 'active', 'suspended').optional(),
    search: joi_1.default.string().optional(),
});
//# sourceMappingURL=affiliate.validators.js.map