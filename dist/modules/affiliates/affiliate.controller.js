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
exports.updateAffiliate = exports.createAffiliate = exports.getAffiliate = exports.listAffiliates = void 0;
const affiliateService = __importStar(require("./affiliate.service"));
const listAffiliates = async (req, res) => {
    const result = await affiliateService.listAffiliates(req.query);
    res.json({ success: true, ...result });
};
exports.listAffiliates = listAffiliates;
const getAffiliate = async (req, res) => {
    const affiliate = await affiliateService.getAffiliateById(Number(req.params.id));
    if (!affiliate) {
        return res.status(404).json({ success: false, message: 'Affiliate not found' });
    }
    return res.json({ success: true, data: affiliate });
};
exports.getAffiliate = getAffiliate;
const createAffiliate = async (req, res) => {
    const affiliate = await affiliateService.createAffiliate(req.body);
    res.status(201).json({ success: true, data: affiliate });
};
exports.createAffiliate = createAffiliate;
const updateAffiliate = async (req, res) => {
    const affiliate = await affiliateService.updateAffiliate(Number(req.params.id), req.body);
    if (!affiliate) {
        return res.status(404).json({ success: false, message: 'Affiliate not found' });
    }
    return res.json({ success: true, data: affiliate });
};
exports.updateAffiliate = updateAffiliate;
//# sourceMappingURL=affiliate.controller.js.map