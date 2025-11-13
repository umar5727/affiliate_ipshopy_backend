import { AdminSetting } from './setting.types';
export declare const listSettings: () => Promise<AdminSetting[]>;
export declare const getSetting: (key: string) => Promise<AdminSetting | null>;
export declare const upsertSetting: (key: string, value: string, description?: string | null) => Promise<AdminSetting>;
//# sourceMappingURL=setting.repository.d.ts.map