import { jsx } from "@app/html-jsx";
import DefaultPage from './pages/default.page.vue';
import ServiceSettingsPage from './pages/serviceSettings.page.vue';
import SettingsTable from "../../tables/v1/settings.table";
import { Debug } from "../../lib/debug.lib";
import { initDebug } from "../../lib/debug.repo";
import { requireRealUser } from "@app/auth";

export const indexRoute = app.get('/', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка главной страницы веб-интерфейса v1');
  
  try {
    Debug.info(ctx, 'Рендеринг default.page.vue');
    return (
      <html>
        <head>
          <title>Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="/s/metric/clarity.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
        </head>
        <body>
          <DefaultPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге главной страницы: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

export const serviceSettingsRoute = app.get('/settings', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка страницы настроек сервиса');
  
  try {
    Debug.info(ctx, 'Рендеринг serviceSettings.page.vue');
    return (
      <html>
        <head>
          <title>Настройки сервиса - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="/s/metric/clarity.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
        </head>
        <body>
          <ServiceSettingsPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге страницы настроек: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

// @shared-route
export const getSettingsRoute = app.get('/api/settings', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API: Получение настроек');
  
  try {
    const settings = await SettingsTable.findAll(ctx, { limit: 1 });
    
    if (settings.length === 0) {
      Debug.warn(ctx, 'Настройки не найдены, возвращаем значения по умолчанию');
      return {
        serviceName: 'Miniapp Video Service',
        logLevel: 'info'
      };
    }
    
    Debug.info(ctx, `Настройки успешно получены: ${JSON.stringify(settings[0])}`);
    return settings[0];
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении настроек: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_SETTINGS');
    throw error;
  }
});

// @shared-route
export const updateSettingsRoute = app.post('/api/settings', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API: Обновление настроек');
  
  try {
    const { serviceName, logLevel } = req.body;
    
    Debug.info(ctx, `Получены данные для обновления: serviceName=${serviceName}, logLevel=${logLevel}`);
    
    if (!serviceName || !logLevel) {
      Debug.warn(ctx, 'Отсутствуют обязательные поля');
      throw Debug.throw(ctx, 'Не указаны обязательные поля', 'E_INVALID_DATA');
    }
    
    if (!['info', 'warn', 'error'].includes(logLevel)) {
      Debug.warn(ctx, `Некорректное значение logLevel: ${logLevel}`);
      throw Debug.throw(ctx, 'Некорректный уровень логирования', 'E_INVALID_LOG_LEVEL');
    }
    
    const existingSettings = await SettingsTable.findAll(ctx, { limit: 1 });
    
    let result;
    if (existingSettings.length === 0) {
      Debug.info(ctx, 'Создание новой записи настроек');
      result = await SettingsTable.create(ctx, {
        serviceName,
        logLevel
      });
    } else {
      const existing = existingSettings[0]!;
      Debug.info(ctx, `Обновление существующей записи настроек с ID: ${existing.id}`);
      result = await SettingsTable.update(ctx, {
        id: existing.id,
        serviceName,
        logLevel
      });
    }
    
    Debug.info(ctx, `Настройки успешно сохранены: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    Debug.error(ctx, `Ошибка при обновлении настроек: ${error instanceof Error ? error.message : String(error)}`, 'E_UPDATE_SETTINGS');
    throw error;
  }
});