import TariffsTable from "../../tables/v1/tariffs.table";
import { Debug } from "../../lib/debug.lib";
import { initializeDebug } from "../../lib/getLogLevel";

// @shared-route
export const getTariffsRoute = app.get('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/tariffs]");
  Debug.info(ctx, 'Запрос на получение списка тарифов');

  try {
    const tariffs = await TariffsTable.findAll(ctx, { 
      limit: 1000,
      order: [{ tid: 'asc' }]
    });
    
    Debug.info(ctx, `Найдено тарифов: ${tariffs.length}`);
    return tariffs;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении тарифов: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_TARIFFS');
    throw error;
  }
});
