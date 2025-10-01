import SettingsTable from "../../../tables/v1/settings.table";
import { ValidationError } from "@app/errors";
import { Debug } from "../../../lib/debug.lib";
import { initializeDebug } from "../../../lib/getLogLevel";

// @shared-route
export const getSettingsRoute = app.get('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/settings]");
  Debug.info(ctx, 'Запрос на получение настроек');

  // Получаем первую запись настроек или создаем дефолтную
  let settings = await SettingsTable.findAll(ctx, { limit: 1 });
  
  if (settings.length === 0) {
    Debug.info(ctx, 'Настройки не найдены, создание дефолтных');
    // Создаем дефолтные настройки
    const defaultSettings = await SettingsTable.create(ctx, {
      logLevel: 'info'
    });
    return defaultSettings;
  }
  
  Debug.info(ctx, 'Настройки найдены и возвращены');
  return settings[0];
});

// @shared-route
export const updateSettingsRoute = app.post('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/settings]");
  Debug.info(ctx, 'Запрос на обновление настроек');

  const { logLevel } = req.body;
  
  // Валидация уровня логирования
  const validLevels = ['error', 'warn', 'info'];
  if (!validLevels.includes(logLevel)) {
    Debug.error(ctx, `Некорректный уровень логирования: ${logLevel}`, 'E_INVALID_LOG_LEVEL');
    throw new ValidationError('Invalid log level. Must be one of: error, warn, info');
  }
  
  // Получаем существующие настройки или создаем новые
  let settings = await SettingsTable.findAll(ctx, { limit: 1 });
  
  if (settings.length === 0) {
    // Создаем новые настройки
    Debug.info(ctx, `Создание новых настроек с уровнем: ${logLevel}`);
    const newSettings = await SettingsTable.create(ctx, {
      logLevel
    });
    return newSettings;
  } else {
    // Обновляем существующие настройки
    const existingSettings = settings[0];
    if (!existingSettings) {
      Debug.error(ctx, 'Настройки не найдены при обновлении', 'E_SETTINGS_NOT_FOUND');
      throw new ValidationError('Settings not found');
    }
    Debug.info(ctx, `Обновление настроек с уровнем: ${logLevel}`);
    const updatedSettings = await SettingsTable.update(ctx, {
      id: existingSettings.id,
      logLevel
    });
    return updatedSettings;
  }
});

