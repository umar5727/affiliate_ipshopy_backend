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
exports.updateOrderStatus = exports.recordOrder = exports.getOrder = exports.listOrders = void 0;
const orderService = __importStar(require("./order.service"));
const listOrders = async (req, res) => {
    const result = await orderService.listOrders(req.query);
    res.json({ success: true, ...result });
};
exports.listOrders = listOrders;
const getOrder = async (req, res) => {
    const order = await orderService.getOrderWithItems(Number(req.params.id));
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, data: order });
};
exports.getOrder = getOrder;
const recordOrder = async (req, res) => {
    const order = await orderService.recordOrder({
        ...req.body,
        orderDate: new Date(req.body.orderDate),
    });
    res.status(201).json({ success: true, data: order });
};
exports.recordOrder = recordOrder;
const updateOrderStatus = async (req, res) => {
    await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
    res.json({ success: true });
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map