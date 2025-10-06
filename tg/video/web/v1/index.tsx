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

export const addVideoRoute = app.get('/add-video', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка страницы добавления видео');
  
  try {
    Debug.info(ctx, 'Рендеринг addVideo.page.vue');
    return (
      <html>
        <head>
          <title>Добавить видео - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="/s/metric/clarity.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
        </head>
        <body>
          <AddVideoPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге страницы добавления видео: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

export const videoListRoute = app.get('/my-videos', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Загрузка списка видео пользователя');
  
  try {
    Debug.info(ctx, 'Рендеринг videoList.page.vue');
    return (
      <html>
        <head>
          <title>Мои видео - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="/s/metric/clarity.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
        </head>
        <body>
          <VideoListPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге списка видео: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
    throw error;
  }
});

export const watchVideoRoute = app.get('/watch/:id', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index');
  Debug.info(ctx, `Загрузка страницы просмотра видео ID: ${req.params.id}`);
  
  try {
    Debug.info(ctx, 'Рендеринг watchVideo.page.vue');
    return (
      <html>
        <head>
          <title>Просмотр видео - Miniapp Video Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="/s/metric/clarity.js"></script>
          <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
        </head>
        <body>
          <WatchVideoPage />
        </body>
      </html>
    );
  } catch (error) {
    Debug.error(ctx, `Ошибка при рендеринге страницы просмотра: ${error instanceof Error ? error.message : String(error)}`, 'E_RENDER');
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
        logLevel: 'info',
        videoCounter: 0
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

// @shared-route
export const addVideoApiRoute = app.post('/api/videos/add', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API: Добавление видео');
  
  try {
    const { title, iframeCode } = req.body;
    
    Debug.info(ctx, `Получены данные: title=${title}, iframeCode length=${iframeCode?.length}`);
    
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
    
    Debug.info(ctx, `Извлечены данные: embedUrl=${embedUrl}, videoId=${videoId}, counter=${currentCounter}`);
    
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
    
    Debug.info(ctx, `Видео успешно добавлено: ${JSON.stringify(video)}`);
    return { success: true, video };
  } catch (error) {
    Debug.error(ctx, `Ошибка при добавлении видео: ${error instanceof Error ? error.message : String(error)}`, 'E_ADD_VIDEO');
    return { success: false, error: 'Произошла ошибка при добавлении видео' };
  }
});

// @shared-route
export const getVideosApiRoute = app.get('/api/videos', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, 'API: Получение списка видео пользователя');
  
  try {
    const videos = await VideosTable.findAll(ctx, {
      where: { owner: ctx.user.id },
      order: [{ createdAt: 'desc' }],
      limit: 100
    });
    
    Debug.info(ctx, `Найдено видео: ${videos.length}`);
    return videos;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении списка видео: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_VIDEOS');
    throw error;
  }
});

// @shared-route
export const deleteVideoApiRoute = app.post('/api/videos/delete/:id', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index/api');
  requireRealUser(ctx);
  Debug.info(ctx, `API: Удаление видео ID: ${req.params.id}`);
  
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
      Debug.warn(ctx, `Попытка удалить чужое видео: user=${ctx.user.id}, owner=${video.owner.id}`);
      return { success: false, error: 'Нет прав на удаление' };
    }
    
    await VideosTable.delete(ctx, video.id);
    Debug.info(ctx, `Видео успешно удалено: ${req.params.id}`);
    return { success: true };
  } catch (error) {
    Debug.error(ctx, `Ошибка при удалении видео: ${error instanceof Error ? error.message : String(error)}`, 'E_DELETE_VIDEO');
    return { success: false, error: 'Произошла ошибка при удалении видео' };
  }
});

// @shared-route
export const getVideoByIdApiRoute = app.get('/api/videos/:id', async (ctx, req) => {
  await initDebug(ctx, 'web/v1/index/api');
  Debug.info(ctx, `API: Получение видео по ID: ${req.params.id}`);
  
  try {
    const videos = await VideosTable.findAll(ctx, {
      where: { videoId: req.params.id },
      limit: 1
    });
    
    if (videos.length === 0) {
      Debug.warn(ctx, `Видео с videoId ${req.params.id} не найдено`);
      return null;
    }
    
    const video = videos[0];
    
    Debug.info(ctx, `Видео найдено: ${video.title}`);
    return video;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении видео: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_VIDEO');
    throw error;
  }
});