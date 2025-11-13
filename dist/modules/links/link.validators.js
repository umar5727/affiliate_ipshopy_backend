"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLinkStatusSchema = exports.listLinksSchema = exports.createLinkSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createLinkSchema = joi_1.default.object({
    productId: joi_1.default.number().integer().positive().optional(),
    url: joi_1.default.string().uri().required(),
    source: joi_1.default.string().max(120).optional().allow(null, ''),
    name: joi_1.default.string().min(2).max(120).optional(),
    channelLink: joi_1.default.string().uri().optional(),
    appLink: joi_1.default.string().uri().optional(),
    websiteLink: joi_1.default.string().uri().optional(),
});
exports.listLinksSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional(),
    pageSize: joi_1.default.number().integer().min(1).max(100).optional(),
    userId: joi_1.default.number().integer().min(1).optional(),
});
exports.updateLinkStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('approved', 'rejected').required(),
    adminRemarks: joi_1.default.string().max(255).allow(null, '').optional(),
});
//# sourceMappingURL=link.validators.js.map