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
exports.updateOrderStatus = exports.processOrderPayload = exports.validateSignature = void 0;
const env_1 = require("../../../config/env");
const hmac_1 = require("../../../utils/hmac");
const affiliateService = __importStar(require("../../affiliates/affiliate.service"));
const orderService = __importStar(require("../../orders/order.service"));
const commissionService = __importStar(require("../../commissions/commission.service"));
const settingService = __importStar(require("../../settings/setting.service"));
const parseRate = async () => {
    const setting = await settingService.getSetting('commission_global_rate');
    if (!setting) {
        return 10;
    }
    const rate = parseFloat(setting.value);
    return Number.isNaN(rate) ? 10 : rate;
};
const validateSignature = (payload, signature) => {
    if (!signature) {
        throw new Error('Missing signature header');
    }
    const body = payload instanceof Buffer ? payload.toString('utf8') : payload;
    const isValid = (0, hmac_1.verifySignature)(body, env_1.env.integrations.opencartSecret, signature);
    if (!isValid) {
        throw new Error('Invalid signature');
    }
};
exports.validateSignature = validateSignature;
const processOrderPayload = async (payload) => {
    const affiliate = await affiliateService.getAffiliateById(payload.affiliateId);
    if (!affiliate) {
        throw new Error('Affiliate not found');
    }
    if (!payload.items?.length) {
        throw new Error('Order items are required');
    }
    const existing = await orderService.findByOpenCartId(payload.orderId);
    const commissionRate = await parseRate();
    const commissionAmount = Number(((payload.totalAmount * commissionRate) / 100).toFixed(2));
    if (existing) {
        await orderService.updateOrderStatus(existing.id, payload.status);
        const commission = await commissionService.findByOrderId(existing.id);
        if (commission) {
            await commissionService.updateCommissionStatus(commission.id, {
                status: payload.status === 'returned' ? 'returned' : commission.status,
                confirmationDate: payload.status === 'confirmed' ? new Date() : commission.confirmationDate,
            });
        }
        return { orderId: existing.id, status: 'updated', commissionAmount };
    }
    const order = await orderService.recordOrder({
        orderIdOpencart: payload.orderId,
        userId: payload.affiliateId,
        status: payload.status,
        totalAmount: payload.totalAmount,
        orderDate: new Date(payload.orderDate),
        items: payload.items,
    });
    await commissionService.createCommission({
        orderId: order.id,
        affiliateLinkId: payload.affiliateLinkId ?? null,
        amount: commissionAmount,
        status: payload.status === 'confirmed' ? 'confirmed' : 'pending',
        confirmationDate: payload.status === 'confirmed' ? new Date() : null,
    });
    return { orderId: order.id, status: 'created', commissionAmount };
};
exports.processOrderPayload = processOrderPayload;
const updateOrderStatus = async (orderId, payload) => {
    const order = await orderService.findByOpenCartId(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    await orderService.updateOrderStatus(order.id, payload.status);
    const commission = await commissionService.findByOrderId(order.id);
    if (commission) {
        await commissionService.updateCommissionStatus(commission.id, {
            status: payload.status,
            confirmationDate: payload.confirmationDate ? new Date(payload.confirmationDate) : null,
        });
    }
    return { orderId: order.id, status: payload.status };
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=opencart.service.js.map