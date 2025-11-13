"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, target = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });
    if (error) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            details: error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            })),
        });
    }
    if (target === 'query' || target === 'params') {
        Object.assign(req[target], value);
    }
    else {
        req[target] = value;
    }
    return next();
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map