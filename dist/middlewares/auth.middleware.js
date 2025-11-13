"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (options = { required: true }) => (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        if (options.required) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        return next();
    }
    const [, token] = header.split(' ');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Invalid authorization header' });
    }
    try {
        const user = (0, jwt_1.verifyAccessToken)(token);
        if (options.roles && !options.roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map