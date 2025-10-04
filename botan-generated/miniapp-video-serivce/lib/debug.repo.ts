import SettingsTable from "../tables/v1/settings.table";
import { Debug, DebugLevel } from "./debug.lib";

/**
 * Получить название сервиса из таблицы настроек.
 * Если настройки не найдены, возвращает дефолтное значение.
 */
export async function getServiceName(ctx: any): Promise<string> {
  try {
    const settings = await SettingsTable.findAll(ctx, { limit: 1 });
    if (settings.length > 0 && settings[0].serviceName) {
      return settings[0].serviceName;
    }
  } catch (error) {
    console.error('Ошибка при получении serviceName из настроек:', error);
  }
  return 'Miniapp Video Service';
}

/**
 * Получить уровень логирования из таблицы настроек.
 * Если настройки не найдены, возвращает 'info'.
 */
export async function getLogLevel(ctx: any): Promise<DebugLevel> {
  try {
    const settings = await SettingsTable.findAll(ctx, { limit: 1 });
    if (settings.length > 0 && settings[0].logLevel) {
      const level = settings[0].logLevel as DebugLevel;
      if (['info', 'warn', 'error'].includes(level)) {
        return level;
      }
    }
  } catch (error) {
    console.error('Ошибка при получении logLevel из настроек:', error);
  }
  return 'info';
}

/**
 * Инициализировать Debug для конкретного файла.
 * @param ctx - контекст запроса
 * @param filename - имя текущего файла (например, 'index' или 'web/v1/index')
 */
export async function initDebug(ctx: any, filename: string): Promise<void> {
  const serviceName = await getServiceName(ctx);
  const logLevel = await getLogLevel(ctx);
  const prefix = `[${serviceName}/${filename}]`;
  
  Debug.configure({ level: logLevel, prefix });
}