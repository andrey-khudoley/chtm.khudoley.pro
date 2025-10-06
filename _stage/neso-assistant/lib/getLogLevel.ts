// @shared
import SettingsTable from "../tables/v1/settings.table";
import type { DebugLevel } from "./debug.lib";

/**
 * Получение уровня логирования из таблицы настроек проекта
 */
export async function getLogLevel(ctx: app.Ctx): Promise<DebugLevel> {
  try {
    const settings = await SettingsTable.findAll(ctx, { limit: 1 });
    
    if (settings.length > 0 && settings[0]?.logLevel) {
      return settings[0].logLevel as DebugLevel;
    }
    
    // По умолчанию возвращаем 'error' если настройки не найдены
    return 'error';
  } catch (error) {
    // В случае ошибки возвращаем безопасный уровень
    return 'error';
  }
}

/**
 * Инициализация Debug с получением уровня из настроек
 */
export async function initializeDebug(ctx: app.Ctx, prefix: string): Promise<void> {
  const level = await getLogLevel(ctx);
  const Debug = (await import("./debug.lib")).Debug;
  Debug.configure({ level, prefix });
}