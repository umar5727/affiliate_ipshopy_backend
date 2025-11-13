"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const signAccessToken = (user) => {
    const payload = {
        sub: user.id,
        role: user.role,
        name: user.name,
        mobileNumber: user.mobileNumber,
        status: user.status,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.accessSecret, { expiresIn: `${env_1.env.jwt.accessTtlMinutes}m` });
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (userId, tokenId) => {
    const payload = {
        sub: userId,
        tokenId,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.refreshSecret, { expiresIn: `${env_1.env.jwt.refreshTtlDays}d` });
};
exports.signRefreshToken = signRefreshToken;
const assertPayload = (decoded) => {
    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload');
    }
    return decoded;
};
const verifyAccessToken = (token) => {
    const decoded = assertPayload(jsonwebtoken_1.default.verify(token, env_1.env.jwt.accessSecret));
    return {
        id: decoded.sub,
        role: decoded.role,
        name: decoded.name,
        mobileNumber: decoded.mobileNumber,
        status: decoded.status,
    };
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return assertPayload(jsonwebtoken_1.default.verify(token, env_1.env.jwt.refreshSecret));
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map