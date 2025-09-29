import SettingsTable from "../../tables/neso_assistent_v1_settings.table";
import { ValidationError } from "@app/errors";

// @shared-route
export const getSettingsRoute = app.get('/', async (ctx, req) => {
  // Получаем первую запись настроек или создаем дефолтную
  let settings = await SettingsTable.findAll(ctx, { limit: 1 });
  
  if (settings.length === 0) {
    // Создаем дефолтные настройки
    const defaultSettings = await SettingsTable.create(ctx, {
      logLevel: 'info'
    });
    return defaultSettings;
  }
  
  return settings[0];
});

// @shared-route
export const updateSettingsRoute = app.post('/', async (ctx, req) => {
  const { logLevel } = req.body;
  
  // Валидация уровня логирования
  const validLevels = ['error', 'warn', 'info'];
  if (!validLevels.includes(logLevel)) {
    throw new ValidationError('Invalid log level. Must be one of: error, warn, info');
  }
  
  // Получаем существующие настройки или создаем новые
  let settings = await SettingsTable.findAll(ctx, { limit: 1 });
  
  if (settings.length === 0) {
    // Создаем новые настройки
    const newSettings = await SettingsTable.create(ctx, {
      logLevel
    });
    return newSettings;
  } else {
    // Обновляем существующие настройки
    const existingSettings = settings[0];
    if (!existingSettings) {
      throw new ValidationError('Settings not found');
    }
    const updatedSettings = await SettingsTable.update(ctx, {
      id: existingSettings.id,
      logLevel
    });
    return updatedSettings;
  }
});