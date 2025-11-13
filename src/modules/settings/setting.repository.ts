import { execute } from '../../config/database';
import { AdminSetting } from './setting.types';

export const listSettings = async (): Promise<AdminSetting[]> => {
  const [rows] = await execute<AdminSetting[]>(
    `
    SELECT \`key\` AS settingKey, value, description, updated_at AS updatedAt
    FROM admin_settings
    ORDER BY \`key\` ASC
  `,
  );
  return rows.map((row: any) => ({ ...row, key: row.settingKey }));
};

export const getSetting = async (key: string): Promise<AdminSetting | null> => {
  const [rows] = await execute<AdminSetting[]>(
    `
    SELECT \`key\` AS settingKey, value, description, updated_at AS updatedAt
    FROM admin_settings
    WHERE \`key\` = ?
  `,
    [key],
  );
  const setting = rows[0] as any;
  return setting ? { key: setting.settingKey, value: setting.value, description: setting.description, updatedAt: setting.updatedAt } : null;
};

export const upsertSetting = async (key: string, value: string, description?: string | null): Promise<AdminSetting> => {
  await execute(
    `
    INSERT INTO admin_settings (\`key\`, value, description)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      value = VALUES(value),
      description = VALUES(description),
      updated_at = NOW()
  `,
    [key, value, description ?? null],
  );

  const [rows] = await execute<AdminSetting[]>(`SELECT \`key\` AS settingKey, value, description, updated_at AS updatedAt FROM admin_settings WHERE \`key\` = ?`, [
    key,
  ]);
  const setting = rows[0] as any;
  if (!setting) {
    throw new Error('Failed to upsert setting');
  }
  return { key: setting.settingKey, value: setting.value, description: setting.description, updatedAt: setting.updatedAt };
};

