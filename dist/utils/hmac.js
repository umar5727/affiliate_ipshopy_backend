"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.generateSignature = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateSignature = (payload, secret) => {
    const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto_1.default.createHmac('sha256', secret).update(body).digest('hex');
};
exports.generateSignature = generateSignature;
const verifySignature = (payload, secret, signature) => {
    const expected = (0, exports.generateSignature)(payload, secret);
    return crypto_1.default.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};
exports.verifySignature = verifySignature;
//# sourceMappingURL=hmac.js.map