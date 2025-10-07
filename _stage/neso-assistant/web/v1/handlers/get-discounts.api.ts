import Discounts from "../../../tables/v1/discounts.table";
import { Debug } from "../../../lib/debug.lib";
import { initializeDebug } from "../../../lib/getLogLevel";

// @shared-route
export const getDiscountsRoute = app.get('/', async (ctx) => {
  await initializeDebug(ctx, "[NeSoAI/web/handlers/discounts]");
  Debug.info(ctx, 'Запрос списка скидок для веб-интерфейса');

  try {
    const discounts = await Discounts.findAll(ctx, {
      limit: 1000,
      order: [{ createdAt: 'desc' }]
    });

    Debug.info(ctx, `Найдено скидок: ${discounts.length}`);
    return discounts;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении списка скидок: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_DISCOUNTS');
    throw error;
  }
});
