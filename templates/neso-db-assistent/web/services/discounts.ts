import Discounts from "../../tables/neso_assistent_v1_discounts.table";
import { Debug } from "../../lib/debug.lib";
import { initializeDebug } from "../../lib/getLogLevel";

// @shared-route
export const getDiscountsRoute = app.get('/', async (ctx) => {
  await initializeDebug(ctx, "[NeSoAI/web/services/discounts]");
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