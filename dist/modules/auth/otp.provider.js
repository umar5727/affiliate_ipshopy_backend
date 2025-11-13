"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpViaInterakt = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const sanitizeMobile = (mobileNumber, countryCode) => {
    const digitsOnly = mobileNumber.replace(/\D/g, '');
    if (!digitsOnly) {
        throw new Error('Invalid mobile number provided');
    }
    const ccNumeric = countryCode.replace(/\D/g, '');
    const ccPrefix = ccNumeric.startsWith('+') ? ccNumeric.slice(1) : ccNumeric;
    const tenDigit = digitsOnly.startsWith(ccPrefix) && digitsOnly.length > ccPrefix.length
        ? digitsOnly.slice(ccPrefix.length)
        : digitsOnly;
    if (tenDigit.length !== 10) {
        throw new Error('Mobile number must be 10 digits');
    }
    console.log('[interakt] sanitizeMobile:', {
        input: mobileNumber,
        countryCode,
        digitsOnly,
        resolved: tenDigit,
    });
    return tenDigit;
};
const sendOtpViaInterakt = async (mobileNumber, otp) => {
    console.log('sendOtpViaInterakt', mobileNumber, otp);
    if (!env_1.env.interakt.apiToken) {
        throw new Error('Interakt API token is not configured');
    }
    const phoneNumber = sanitizeMobile(mobileNumber, env_1.env.interakt.countryCode);
    if (phoneNumber.length < 8) {
        throw new Error('Mobile number is too short to send OTP');
    }
    const payload = {
        countryCode: env_1.env.interakt.countryCode,
        phoneNumber,
        callbackData: env_1.env.interakt.callbackData,
        type: 'Template',
        template: {
            name: env_1.env.interakt.templateName,
            languageCode: env_1.env.interakt.languageCode,
            bodyValues: [otp],
            buttonValues: {
                0: [otp],
            },
        },
    };
    try {
        console.log('[interakt] request prepared', {
            endpoint: env_1.env.interakt.apiUrl,
            phoneNumber,
            payload,
        });
        const response = await axios_1.default.post(env_1.env.interakt.apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Basic ${env_1.env.interakt.apiToken}`,
            },
            timeout: 10000,
            validateStatus: (status) => status >= 200 && status < 300,
        });
        console.log('[interakt] response received', {
            status: response.status,
            data: response.data,
            headers: response.headers,
        });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data;
            console.error('[interakt] request failed', {
                status,
                data,
                message: error.message,
                headers: error.response?.headers,
            });
            throw new Error(data?.message ??
                `Failed to send OTP via Interakt${status ? ` (status ${status})` : ''}. Please verify template and credentials.`);
        }
        console.error('[interakt] unexpected error', error);
        throw error;
    }
};
exports.sendOtpViaInterakt = sendOtpViaInterakt;
//# sourceMappingURL=otp.provider.js.map