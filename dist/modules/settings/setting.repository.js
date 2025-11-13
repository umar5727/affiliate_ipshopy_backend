"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertSetting = exports.getSetting = exports.listSettings = void 0;
const database_1 = require("../../config/database");
const listSettings = async () => {
    const [rows] = await (0, database_1.execute)(`
    SELECT \`key\` AS settingKey, value, description, updated_at AS updatedAt
    FROM admin_settings
    ORDER BY \`key\` ASC
  `);
    return rows.map((row) => ({ ...row, key: row.settingKey }));
};
exports.listSettings = listSettings;
const getSetting = async (key) => {
    const [rows] = await (0, database_1.execute)(`
    SELECT \`key\` AS settingKey, value, description, updated_at AS updatedAt
    FROM admin_settings
    WHERE \`key\` = ?
  `, [key]);
    const setting = rows[0];
    return setting ? { key: setting.settingKey, value: setting.value, description: setting.description, updatedAt: setting.updatedAt } : null;
};
exports.getSetting = getSetting;
const upsertSetting = async (key, value, description) => {
    await (0, database_1.execute)(`
    INSERT INTO admin_settings (\`key\`, value, description)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      value = VALUES(value),
      description = VALUES(description),
      updated_at = NOW()
  `, [key, value, description ?? null]);
    const [rows] = await (0, database_1.execute)(`SELECT \`key\` AS settingKey, value, description, updated_at AS updatedAt FROM admin_settings WHERE \`key\` = ?`, [
        key,
    ]);
    const setting = rows[0];
    if (!setting) {
        throw new Error('Failed to upsert setting');
    }
    return { key: setting.settingKey, value: setting.value, description: setting.description, updatedAt: setting.updatedAt };
};
exports.upsertSetting = upsertSetting;
//# sourceMappingURL=setting.repository.js.map