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
exports.refreshToken = exports.verifyOtp = exports.requestOtp = void 0;
const authService = __importStar(require("./auth.service"));
const requestOtp = async (req, res) => {
    try {
        const otp = await authService.requestOtp(req.body.mobileNumber);
        console.log('Generated OTP:', otp);
        res.json({
            success: true,
            message: 'OTP generated successfully',
            // Note: In production the OTP should be sent via WhatsApp/SMS provider.
            debug: process.env.NODE_ENV !== 'production' ? { otp } : undefined,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.requestOtp = requestOtp;
const verifyOtp = async (req, res) => {
    try {
        const result = await authService.verifyOtp(req.body);
        res.json({ success: true, ...result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.verifyOtp = verifyOtp;
const refreshToken = async (req, res) => {
    try {
        const tokens = await authService.refreshTokens(req.body.refreshToken);
        res.json({ success: true, tokens });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map