"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.verifyOtpSchema = exports.requestOtpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.requestOtpSchema = joi_1.default.object({
    mobileNumber: joi_1.default.string().pattern(/^\d{10,15}$/).required(),
});
exports.verifyOtpSchema = joi_1.default.object({
    mobileNumber: joi_1.default.string().pattern(/^\d{10,15}$/).required(),
    otp: joi_1.default.string().length(6).required(),
});
exports.refreshSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required(),
});
//# sourceMappingURL=admin.validators.js.map