import { jsx } from "@app/html-jsx";
import { indexRoute as webV1IndexRoute } from './web/v1/index';
import { Debug } from "./lib/debug.lib";
import { initDebug } from "./lib/debug.repo";
import { requireRealUser } from "@app/auth";

app.get("/", async (ctx, req) => {
  await initDebug(ctx, 'index');
  requireRealUser(ctx);
  Debug.info(ctx, 'Запрос к корневому индексу, выполняем редирект на актуальную версию');
  
  try {
    const targetUrl = webV1IndexRoute.url();
    Debug.info(ctx, `Редирект на: ${targetUrl}`);
    return ctx.resp.redirect(targetUrl);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Debug.error(ctx, `Ошибка при редиректе: ${errorMessage}`, 'E_REDIRECT');
    throw error;
  }
});