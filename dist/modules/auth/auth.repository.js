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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRefreshToken = exports.revokeRefreshToken = exports.storeRefreshToken = exports.markWhatsAppVerified = exports.createAffiliate = exports.findUserByMobile = exports.validateOtp = exports.upsertOtp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../../config/database");
const affiliateRepository = __importStar(require("../affiliates/affiliate.repository"));
const upsertOtp = async (mobileNumber, otp, ttlMinutes) => {
    const hash = await bcryptjs_1.default.hash(otp, 10);
    await (0, database_1.execute)(`
    INSERT INTO otp_tokens (mobile_number, otp_hash, expires_at, attempts)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), 0)
    ON DUPLICATE KEY UPDATE
      otp_hash = VALUES(otp_hash),
      expires_at = VALUES(expires_at),
      attempts = 0,
      updated_at = NOW()
  `, [mobileNumber, hash, ttlMinutes]);
};
exports.upsertOtp = upsertOtp;
const validateOtp = async (mobileNumber, otp) => {
    const [rows] = await (0, database_1.execute)(`
    SELECT id, mobile_number AS mobileNumber, otp_hash AS otpHash, expires_at AS expiresAt, attempts
    FROM otp_tokens
    WHERE mobile_number = ?
    `, [mobileNumber]);
    const record = rows[0];
    if (!record) {
        return false;
    }
    if (record.expiresAt < new Date()) {
        await (0, database_1.execute)('DELETE FROM otp_tokens WHERE id = ?', [record.id]);
        return false;
    }
    const isMatch = await bcryptjs_1.default.compare(otp, record.otpHash);
    await (0, database_1.execute)('UPDATE otp_tokens SET attempts = attempts + 1, updated_at = NOW() WHERE id = ?', [record.id]);
    if (!isMatch) {
        return false;
    }
    await (0, database_1.execute)('DELETE FROM otp_tokens WHERE id = ?', [record.id]);
    return true;
};
exports.validateOtp = validateOtp;
exports.findUserByMobile = affiliateRepository.findByMobile;
exports.createAffiliate = affiliateRepository.createAffiliate;
const markWhatsAppVerified = async (userId, connection) => {
    await (0, database_1.execute)('UPDATE users SET whatsapp_verified = 1, updated_at = NOW() WHERE id = ?', [userId], connection);
};
exports.markWhatsAppVerified = markWhatsAppVerified;
const storeRefreshToken = async (userId, tokenId, expiresInDays, connection) => {
    await (0, database_1.execute)(`
    INSERT INTO refresh_tokens (user_id, token_id, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
  `, [userId, tokenId, expiresInDays], connection);
};
exports.storeRefreshToken = storeRefreshToken;
const revokeRefreshToken = async (tokenId) => {
    await (0, database_1.execute)('DELETE FROM refresh_tokens WHERE token_id = ?', [tokenId]);
};
exports.revokeRefreshToken = revokeRefreshToken;
const findRefreshToken = async (tokenId) => {
    const [rows] = await (0, database_1.execute)(`
    SELECT user_id AS userId, expires_at AS expiresAt
    FROM refresh_tokens
    WHERE token_id = ?
    `, [tokenId]);
    return rows[0] ?? null;
};
exports.findRefreshToken = findRefreshToken;
//# sourceMappingURL=auth.repository.js.map