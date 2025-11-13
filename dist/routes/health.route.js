"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
const database_1 = require("../config/database");
exports.healthRouter = (0, express_1.Router)();
exports.healthRouter.get('/', async (_req, res, next) => {
    try {
        await (0, database_1.healthCheck)();
        res.json({ success: true, status: 'ok' });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=health.route.js.map