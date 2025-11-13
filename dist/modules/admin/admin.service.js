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
const env_1 = require("../../config/env");
const jwt_1 = require("../../utils/jwt");
const adminRepository = __importStar(require("./admin.repository"));
const authRepository = __importStar(require("../auth/auth.repository"));
const otp_provider_1 = require("../auth/otp.provider");
const ADMIN_OTP_TTL_MINUTES = 5;
const toAuthenticatedAdmin = (admin) => {
    if (!admin) {
        throw new Error('Admin not found');
    }
    return {
        id: admin.id,
        name: admin.name,
        mobileNumber: admin.mobileNumber,
        role: 'admin',
        status: admin.status,
    };
};
const requestOtp = async (mobileNumber) => {
    const admin = await adminRepository.findByMobile(mobileNumber);
    if (!admin || admin.status !== 'active') {
        throw new Error('Admin account not found or suspended');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await authRepository.upsertOtp(mobileNumber, otp, ADMIN_OTP_TTL_MINUTES);
    if (env_1.env.otp.provider === 'interakt') {
        await (0, otp_provider_1.sendOtpViaInterakt)(mobileNumber, otp);
    }
    return otp;
};
exports.requestOtp = requestOtp;
const verifyOtp = async (mobileNumber, otp) => {
    const admin = await adminRepository.findByMobile(mobileNumber);
    if (!admin || admin.status !== 'active') {
        throw new Error('Admin account not found or suspended');
    }
    const isValid = await authRepository.validateOtp(mobileNumber, otp);
    if (!isValid) {
        throw new Error('Invalid or expired OTP');
    }
    await adminRepository.markWhatsAppVerified(admin.id);
    const authAdmin = toAuthenticatedAdmin(admin);
    const tokenId = (0, uuid_1.v4)();
    await adminRepository.storeRefreshToken(admin.id, tokenId, env_1.env.jwt.refreshTtlDays);
    return {
        admin: authAdmin,
        tokens: {
            accessToken: (0, jwt_1.signAccessToken)(authAdmin),
            refreshToken: (0, jwt_1.signRefreshToken)(admin.id, tokenId),
            expiresIn: env_1.env.jwt.accessTtlMinutes * 60,
        },
    };
};
exports.verifyOtp = verifyOtp;
const refreshTokens = async (refreshToken) => {
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const stored = await adminRepository.findRefreshToken(payload.tokenId);
    if (!stored || stored.adminUserId !== payload.sub || stored.expiresAt < new Date()) {
        throw new Error('Refresh token expired');
    }
    await adminRepository.revokeRefreshToken(payload.tokenId);
    const admin = await adminRepository.findById(stored.adminUserId);
    if (!admin) {
        throw new Error('Admin account not found');
    }
    const authAdmin = toAuthenticatedAdmin(admin);
    const tokenId = (0, uuid_1.v4)();
    await adminRepository.storeRefreshToken(admin.id, tokenId, env_1.env.jwt.refreshTtlDays);
    return {
        admin: authAdmin,
        tokens: {
            accessToken: (0, jwt_1.signAccessToken)(authAdmin),
            refreshToken: (0, jwt_1.signRefreshToken)(admin.id, tokenId),
            expiresIn: env_1.env.jwt.accessTtlMinutes * 60,
        },
    };
};
exports.refreshTokens = refreshTokens;
//# sourceMappingURL=admin.service.js.map