import * as repository from './setting.repository';

export const listSettings = repository.listSettings;

export const updateSetting = repository.upsertSetting;

export const getSetting = repository.getSetting;

export const getSettings = async (keys: string[]) => {
  const settings = await Promise.all(keys.map((key) => repository.getSetting(key)));
  const result: Record<string, string | null> = {};
  keys.forEach((key, index) => {
    result[key] = settings[index]?.value ?? null;
  });
  return result;
};

