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
exports.updatePayment = exports.createPayment = exports.listPayments = void 0;
const paymentService = __importStar(require("./payment.service"));
const listPayments = async (req, res) => {
    const query = { ...req.query };
    if (req.user?.role === 'affiliate') {
        query.userId = String(req.user.id);
    }
    const result = await paymentService.listPayments(query);
    res.json({ success: true, ...result });
};
exports.listPayments = listPayments;
const createPayment = async (req, res) => {
    const payment = await paymentService.createPaymentRequest(req.body);
    res.status(201).json({ success: true, data: payment });
};
exports.createPayment = createPayment;
const updatePayment = async (req, res) => {
    const payment = await paymentService.updatePayment(Number(req.params.id), {
        ...req.body,
        paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : null,
    });
    res.json({ success: true, data: payment });
};
exports.updatePayment = updatePayment;
//# sourceMappingURL=payment.controller.js.map