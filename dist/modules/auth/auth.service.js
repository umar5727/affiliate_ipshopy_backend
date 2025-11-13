"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.verifyOtp = exports.requestOtp = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../../config/database");
const env_1 = require("../../config/env");
const jwt_1 = require("../../utils/jwt");
const authRepository = __importStar(require("./auth.repository"));
const affiliateRepository = __importStar(require("../affiliates/affiliate.repository"));
const otp_provider_1 = require("./otp.provider");
const OTP_TTL_MINUTES = 5;
const toAuthenticatedUser = async (userId) => {
    const user = await affiliateRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        role: user.role,
        status: user.status,
    };
};
const requestOtp = async (mobileNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await authRepository.upsertOtp(mobileNumber, otp, OTP_TTL_MINUTES);
    console.log('requestOtp', mobileNumber, otp);
    if (env_1.env.otp.provider === 'interakt') {
        await (0, otp_provider_1.sendOtpViaInterakt)(mobileNumber, otp);
    }
    return otp;
};
exports.requestOtp = requestOtp;
const verifyOtp = async (payload) => {
    const isValid = await authRepository.validateOtp(payload.mobileNumber, payload.otp);
    if (!isValid) {
        throw new Error('Invalid or expired OTP');
    }
    const { user, isNew } = await (0, database_1.withTransaction)(async (connection) => {
        const existing = await authRepository.findUserByMobile(payload.mobileNumber);
        if (existing) {
            await authRepository.markWhatsAppVerified(existing.id, connection);
            return { user: existing, isNew: false };
        }
        const derivedName = payload.name && payload.name.trim().length > 1
            ? payload.name.trim()
            : `Creator ${payload.mobileNumber.slice(-4)}`;
        const affiliatePayload = {
            name: derivedName,
            mobileNumber: payload.mobileNumber,
            channelLink: payload.channelLink ?? null,
            appLink: payload.appLink ?? null,
            websiteLink: payload.websiteLink ?? null,
            role: 'affiliate',
            status: 'pending',
        };
        const created = await authRepository.createAffiliate(affiliatePayload, connection);
        await authRepository.markWhatsAppVerified(created.id, connection);
        return { user: created, isNew: true };
    });
    const authUser = await toAuthenticatedUser(user.id);
    const tokenId = (0, uuid_1.v4)();
    await authRepository.storeRefreshToken(user.id, tokenId, env_1.env.jwt.refreshTtlDays);
    return {
        isNew,
        user: authUser,
        tokens: {
            accessToken: (0, jwt_1.signAccessToken)(authUser),
            refreshToken: (0, jwt_1.signRefreshToken)(user.id, tokenId),
            expiresIn: env_1.env.jwt.accessTtlMinutes * 60,
        },
    };
};
exports.verifyOtp = verifyOtp;
const refreshTokens = async (refreshToken) => {
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const stored = await authRepository.findRefreshToken(payload.tokenId);
    if (!stored || stored.userId !== payload.sub || stored.expiresAt < new Date()) {
        throw new Error('Refresh token expired');
    }
    await authRepository.revokeRefreshToken(payload.tokenId);
    const user = await toAuthenticatedUser(stored.userId);
    const tokenId = (0, uuid_1.v4)();
    await authRepository.storeRefreshToken(user.id, tokenId, env_1.env.jwt.refreshTtlDays);
    return {
        accessToken: (0, jwt_1.signAccessToken)(user),
        refreshToken: (0, jwt_1.signRefreshToken)(user.id, tokenId),
        expiresIn: env_1.env.jwt.accessTtlMinutes * 60,
    };
};
exports.refreshTokens = refreshTokens;
//# sourceMappingURL=auth.service.js.map