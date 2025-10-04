import { jsx } from "@app/html-jsx";
import { indexRoute as webV1IndexRoute } from './web/v1/index';
import { Debug } from "./lib/debug.lib";
import { initDebug } from "./lib/debug.repo";

app.get("/", async (ctx, req) => {
  await initDebug(ctx, 'index');
  Debug.info(ctx, 'Запрос к корневому индексу, выполняем редирект на актуальную версию');
  
  try {
    const targetUrl = webV1IndexRoute.url();
    Debug.info(ctx, `Редирект на: ${targetUrl}`);
    return ctx.resp.redirect(targetUrl);
  } catch (error) {
    Debug.error(ctx, `Ошибка при редиректе: ${error.message}`, 'E_REDIRECT');
    throw error;
  }
});