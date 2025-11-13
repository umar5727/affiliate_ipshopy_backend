"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interaktDebugRouter = void 0;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
exports.interaktDebugRouter = (0, express_1.Router)();
exports.interaktDebugRouter.post('/interakt/test', async (req, res) => {
    const phoneNumber = req.body?.phoneNumber;
    const otp = req.body?.otp ?? '000000';
    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: 'phoneNumber is required' });
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
        const response = await axios_1.default.post(env_1.env.interakt.apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Basic ${env_1.env.interakt.apiToken}`,
            },
            timeout: 10000,
            validateStatus: () => true,
        });
        logger_1.logger.info('Interakt debug request completed', {
            status: response.status,
            data: response.data,
            headers: response.headers,
        });
        return res.status(response.status).json({
            success: response.status >= 200 && response.status < 300,
            requestPayload: payload,
            responseStatus: response.status,
            responseData: response.data,
            responseHeaders: response.headers,
        });
    }
    catch (error) {
        logger_1.logger.error('Interakt debug request failed', error);
        if (axios_1.default.isAxiosError(error)) {
            return res.status(error.response?.status ?? 500).json({
                success: false,
                message: error.message,
                responseData: error.response?.data,
                responseHeaders: error.response?.headers,
            });
        }
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
//# sourceMappingURL=interakt-debug.route.js.map