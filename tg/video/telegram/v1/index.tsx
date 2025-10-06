import { jsx } from "@app/html-jsx";
import DefaultPage from './pages/default.page.vue';
import ServiceSettingsPage from './pages/serviceSettings.page.vue';
import AddVideoPage from './pages/addVideo.page.vue';
import VideoListPage from './pages/videoList.page.vue';
import WatchVideoPage from './pages/watchVideo.page.vue';
import SettingsTable from "../../tables/v1/settings.table";
import VideosTable from "../../tables/v1/videos.table";
import { Debug } from "../../lib/debug.lib";
import { initDebug } from "../../lib/debug.repo";
import { requireRealUser } from "@app/auth";

export const indexRoute = app.get('/', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка главной страницы Telegram miniapp v1');
  
  try {
    Debug.info(ctx, 'Рендеринг default.page.vue для Telegram');
    return (
      <html>
        <head>
          <title>Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
          <script src="/s/metric/clarity.js"></script>
          <script>{`
            // Инициализация Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
              
              // Запрос разрешения на отправку сообщений ботом
              try {
                if (window.Telegram.WebApp.requestWriteAccess) {
                  window.Telegram.WebApp.requestWriteAccess();
                }
              } catch (error) {
                console.log('Не удалось запросить разрешение на отправку сообщений:', error);
              }
            }
          `}</script>
        </head>
        <body>
          <DefaultPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге главной страницы Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

export const serviceSettingsRoute = app.get('/settings', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка страницы настроек сервиса Telegram miniapp');
  
  try {
    Debug.info(ctx, 'Рендеринг serviceSettings.page.vue для Telegram');
    return (
      <html>
        <head>
          <title>Настройки - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
          <script src="/s/metric/clarity.js"></script>
          <script>{`
            // Инициализация Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
            }
          `}</script>
        </head>
        <body>
          <ServiceSettingsPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге страницы настроек Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

export const addVideoRoute = app.get('/add-video', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка страницы добавления видео Telegram miniapp');
  
  try {
    Debug.info(ctx, 'Рендеринг addVideo.page.vue для Telegram');
    return (
      <html>
        <head>
          <title>Добавить видео - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
          <script src="/s/metric/clarity.js"></script>
          <script>{`
            // Инициализация Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
            }
          `}</script>
        </head>
        <body>
          <AddVideoPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге страницы добавления видео Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

export const videoListRoute = app.get('/my-videos', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка списка видео пользователя Telegram miniapp');
  
  try {
    Debug.info(ctx, 'Рендеринг videoList.page.vue для Telegram');
    return (
      <html>
        <head>
          <title>Мои видео - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
          <script src="/s/metric/clarity.js"></script>
          <script>{`
            // Инициализация Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
            }
          `}</script>
        </head>
        <body>
          <VideoListPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге списка видео Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

export const watchVideoRoute = app.get('/watch/:id', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index');
  Debug.info(ctx, `Загрузка страницы просмотра видео Telegram miniapp ID: ${req.params.id}`);
  
  try {
    Debug.info(ctx, 'Рендеринг watchVideo.page.vue для Telegram');
    return (
      <html>
        <head>
          <title>Просмотр видео - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
          <script src="/s/metric/clarity.js"></script>
          <script>{`
            // Инициализация Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
            }
          `}</script>
        </head>
        <body>
          <WatchVideoPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге страницы просмотра Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

// @shared-route
export const getSettingsRoute = app.get('/api/settings', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API Telegram: Получение настроек');
  
  try {
    const settings = await SettingsTable.findAll(ctx, { limit: 1 });
    
    if (settings.length === 0) {
      Debug.warn(ctx, 'Настройки не найдены, возвращаем значения по умолчанию');
      return {
        serviceName: 'Miniapp Video Service',
        logLevel: 'info',
        videoCounter: 0
      };
    }
    
    Debug.info(ctx, `Настройки успешно получены для Telegram: ${JSON.stringify(settings[0])}`);
    return settings[0];
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении настроек для Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_SETTINGS');
    throw error;
  }
});

// @shared-route
export const updateSettingsRoute = app.post('/api/settings', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API Telegram: Обновление настроек');
  
  try {
    const { serviceName, logLevel } = req.body;
    
    Debug.info(ctx, `Получены данные для обновления из Telegram: serviceName=${serviceName}, logLevel=${logLevel}`);
    
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
      Debug.info(ctx, 'Создание новой записи настроек из Telegram');
      result = await SettingsTable.create(ctx, {
        serviceName,
        logLevel
      });
    } else {
      const existingSetting = existingSettings[0]!;
      Debug.info(ctx, `Обновление существующей записи настроек из Telegram с ID: ${existingSetting.id}`);
      result = await SettingsTable.update(ctx, {
        id: existingSetting.id,
        serviceName,
        logLevel
      });
    }
    
    Debug.info(ctx, `Настройки успешно сохранены из Telegram: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    Debug.error(ctx, `Ошибка при обновлении настроек из Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_UPDATE_SETTINGS');
    throw error;
  }
});

// @shared-route
export const addVideoApiRoute = app.post('/api/videos/add', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API Telegram: Добавление видео');
  
  try {
    const { title, iframeCode } = req.body;
    
    Debug.info(ctx, `Получены данные из Telegram: title=${title}, iframeCode length=${iframeCode?.length}`);
    
    if (!title || !iframeCode) {
      Debug.warn(ctx, 'Отсутствуют обязательные поля');
      return { success: false, error: 'Не указаны обязательные поля' };
    }
    
    const srcMatch = iframeCode.match(/src="([^"]+)"/);
    if (!srcMatch) {
      Debug.warn(ctx, 'Не удалось извлечь URL из iframe кода');
      return { success: false, error: 'Некорректный код iframe' };
    }
    
    const embedUrl = srcMatch[1];
    
    // Получаем текущий счётчик видео
    const settings = await SettingsTable.findAll(ctx, { limit: 1 });
    let currentCounter = 0;
    
    if (settings.length > 0) {
      currentCounter = settings[0].videoCounter || 0;
    }
    
    // Увеличиваем счётчик и создаём короткий ID
    currentCounter++;
    const videoId = currentCounter.toString().padStart(8, '0');
    
    Debug.info(ctx, `Извлечены данные из Telegram: embedUrl=${embedUrl}, videoId=${videoId}, counter=${currentCounter}`);
    
    const video = await VideosTable.create(ctx, {
      videoId,
      embedUrl,
      title,
      owner: ctx.user.id
    });
    
    // Обновляем счётчик в настройках
    if (settings.length > 0) {
      await SettingsTable.update(ctx, {
        id: settings[0].id,
        videoCounter: currentCounter
      });
    } else {
      await SettingsTable.create(ctx, {
        serviceName: 'Miniapp Video Service',
        logLevel: 'info',
        videoCounter: currentCounter
      });
    }
    
    Debug.info(ctx, `Видео успешно добавлено из Telegram: ${JSON.stringify(video)}`);
    return { success: true, video };
  } catch (error) {
    Debug.error(ctx, `Ошибка при добавлении видео из Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_ADD_VIDEO');
    return { success: false, error: 'Произошла ошибка при добавлении видео' };
  }
});

// @shared-route
export const getVideosApiRoute = app.get('/api/videos', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API Telegram: Получение списка видео пользователя');
  
  try {
    const videos = await VideosTable.findAll(ctx, {
      where: { owner: ctx.user.id },
      order: [{ createdAt: 'desc' }],
      limit: 100
    });
    
    Debug.info(ctx, `Найдено видео из Telegram: ${videos.length}`);
    return videos;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении списка видео из Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_VIDEOS');
    throw error;
  }
});

// @shared-route
export const deleteVideoApiRoute = app.post('/api/videos/delete/:id', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, `API Telegram: Удаление видео ID: ${req.params.id}`);
  
  try {
    const videos = await VideosTable.findAll(ctx, {
      where: { videoId: req.params.id },
      limit: 1
    });
    
    if (videos.length === 0) {
      Debug.warn(ctx, `Видео с videoId ${req.params.id} не найдено`);
      return { success: false, error: 'Видео не найдено' };
    }
    
    const video = videos[0];
    
    if (video.owner.id !== ctx.user.id) {
      Debug.warn(ctx, `Попытка удалить чужое видео из Telegram: user=${ctx.user.id}, owner=${video.owner.id}`);
      return { success: false, error: 'Нет прав на удаление' };
    }
    
    await VideosTable.delete(ctx, video.id);
    Debug.info(ctx, `Видео успешно удалено из Telegram: ${req.params.id}`);
    return { success: true };
  } catch (error) {
    Debug.error(ctx, `Ошибка при удалении видео из Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_DELETE_VIDEO');
    return { success: false, error: 'Произошла ошибка при удалении видео' };
  }
});

// @shared-route
export const getVideoByIdApiRoute = app.get('/api/videos/:id', async (ctx, req) => {
  await initDebug(ctx, 'telegram/v1/index/api');
  Debug.info(ctx, `API Telegram: Получение видео по ID: ${req.params.id}`);
  
  try {
    const videos = await VideosTable.findAll(ctx, {
      where: { videoId: req.params.id },
      limit: 1
    });
    
    if (videos.length === 0) {
      Debug.warn(ctx, `Видео с videoId ${req.params.id} не найдено из Telegram`);
      return null;
    }
    
    const video = videos[0];
    
    Debug.info(ctx, `Видео найдено из Telegram: ${video.title}`);
    return video;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении видео из Telegram: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_VIDEO');
    throw error;
  }
});