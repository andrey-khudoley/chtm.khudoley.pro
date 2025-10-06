import { jsx } from "@app/html-jsx";
import WatchVideoPage from './web/v1/pages/watchVideo.page.vue';
import { Debug } from "./lib/debug.lib";
import { initDebug } from "./lib/debug.repo";
import { requireRealUser } from "@app/auth";
import VideosTable from "./tables/v1/videos.table";

app.get("/", async (ctx, req) => {
  await initDebug(ctx, 'index');
  Debug.info(ctx, 'Запрос к корневому индексу, показываем страницу просмотра видео');
  
  try {
    Debug.info(ctx, 'Рендеринг watchVideo.page.vue для корневого маршрута');
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    Debug.error(ctx, `Ошибка при рендеринге корневого маршрута: ${errorMessage}`, 'E_RENDER');
    throw error;
  }
});

// Экспорт маршрута для генерации коротких ссылок
export const watchVideoRoute = app.get('/watch/:id', async (ctx, req) => {
  await initDebug(ctx, 'index/watch');
  Debug.info(ctx, `Запрос на просмотр видео ID: ${req.params.id}`);
  
  try {
    Debug.info(ctx, 'Рендеринг watchVideo.page.vue для корневого маршрута просмотра');
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    Debug.error(ctx, `Ошибка при рендеринге страницы просмотра видео: ${errorMessage}`, 'E_RENDER');
    throw error;
  }
});

// @shared-route
export const getVideoByIdApiRoute = app.get('/api/videos/:id', async (ctx, req) => {
  await initDebug(ctx, 'index/api');
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
    
    if (!video) {
      Debug.warn(ctx, `Видео не найдено для ID: ${req.params.id}`);
      return null;
    }
    
    Debug.info(ctx, `Видео найдено: ${video.title}`);
    return video;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении видео: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_VIDEO');
    throw error;
  }
});