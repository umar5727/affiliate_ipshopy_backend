declare module 'express-serve-static-core' {
    interface Request {
        rawBody?: Buffer;
    }
}
export declare const createApp: () => import("express-serve-static-core").Express;
//# sourceMappingURL=app.d.ts.map