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
exports.updateLinkStatus = exports.createLink = exports.listLinks = void 0;
const linkService = __importStar(require("./link.service"));
const affiliateRepository = __importStar(require("../affiliates/affiliate.repository"));
const listLinks = async (req, res) => {
    const query = { ...req.query };
    if (req.user?.role === 'affiliate') {
        query.userId = String(req.user.id);
    }
    const result = await linkService.listLinks(query);
    res.json({ success: true, ...result });
};
exports.listLinks = listLinks;
const createLink = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const link = await linkService.createLink({
        userId: req.user.id,
        url: req.body.url,
        source: req.body.source,
        productId: req.body.productId,
        name: req.body.name,
        channelLink: req.body.channelLink,
        appLink: req.body.appLink,
        websiteLink: req.body.websiteLink,
    });
    const profile = await affiliateRepository.findById(req.user.id);
    return res.status(201).json({ success: true, data: { link, profile } });
};
exports.createLink = createLink;
const updateLinkStatus = async (req, res) => {
    const updated = await linkService.updateLinkStatus(Number(req.params.id), req.body);
    if (!updated) {
        return res.status(404).json({ success: false, message: 'Link not found' });
    }
    return res.json({ success: true, data: updated });
};
exports.updateLinkStatus = updateLinkStatus;
//# sourceMappingURL=link.controller.js.map