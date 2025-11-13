"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateSettingSchema = joi_1.default.object({
    key: joi_1.default.string().required(),
    value: joi_1.default.alternatives(joi_1.default.string(), joi_1.default.number(), joi_1.default.boolean()).required(),
    description: joi_1.default.string().allow(null, '').optional(),
});
//# sourceMappingURL=setting.validators.js.map