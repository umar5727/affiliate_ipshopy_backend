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
exports.getCreatorSettings = exports.updateSetting = exports.listSettings = void 0;
const settingService = __importStar(require("./setting.service"));
const listSettings = async (_req, res) => {
    const settings = await settingService.listSettings();
    res.json({ success: true, data: settings });
};
exports.listSettings = listSettings;
const updateSetting = async (req, res) => {
    const setting = await settingService.updateSetting(req.body.key, String(req.body.value), req.body.description ?? null);
    res.json({ success: true, data: setting });
};
exports.updateSetting = updateSetting;
const getCreatorSettings = async (_req, res) => {
    const keys = ['video_login_url', 'video_home_url', 'video_payments_url', 'payout_minimum_threshold', 'payout_window_days'];
    const settings = await settingService.getSettings(keys);
    res.json({ success: true, data: settings });
};
exports.getCreatorSettings = getCreatorSettings;
//# sourceMappingURL=setting.controller.js.map