export declare const listSettings: () => Promise<import("./setting.types").AdminSetting[]>;
export declare const updateSetting: (key: string, value: string, description?: string | null) => Promise<import("./setting.types").AdminSetting>;
export declare const getSetting: (key: string) => Promise<import("./setting.types").AdminSetting | null>;
export declare const getSettings: (keys: string[]) => Promise<Record<string, string | null>>;
//# sourceMappingURL=setting.service.d.ts.map