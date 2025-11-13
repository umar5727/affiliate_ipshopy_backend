export declare const env: {
    nodeEnv: string;
    port: number;
    mysql: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        connectionLimit: number;
    };
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessTtlMinutes: number;
        refreshTtlDays: number;
    };
    otp: {
        provider: string;
        rateLimitPerHour: number;
    };
    redis: {
        url: string;
        host: string | undefined;
        port: number | undefined;
        password: string | undefined;
    };
    integrations: {
        opencartSecret: string;
    };
    interakt: {
        apiUrl: string;
        apiToken: string;
        countryCode: string;
        templateName: string;
        languageCode: string;
        callbackData: string;
    };
};
export declare const isProduction: boolean;
//# sourceMappingURL=env.d.ts.map