"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPagination = exports.parsePagination = void 0;
const parsePagination = (query) => {
    const page = Math.max(parseInt(query.page ?? '1', 10), 1);
    const pageSize = Math.max(Math.min(parseInt(query.pageSize ?? '20', 10), 100), 1);
    return { page, pageSize };
};
exports.parsePagination = parsePagination;
const buildPagination = (data, page, pageSize, total) => ({
    data,
    pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
    },
});
exports.buildPagination = buildPagination;
//# sourceMappingURL=pagination.js.map