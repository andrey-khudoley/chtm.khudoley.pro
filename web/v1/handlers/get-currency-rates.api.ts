import CurrencyRatesTable from "../../../tables/v1/currency_rates.table";
import { Debug } from "../../../lib/debug.lib";
import { initializeDebug } from "../../../lib/getLogLevel";

// @shared-route
export const getCurrencyRatesRoute = app.get('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/currencyRates]");
  Debug.info(ctx, 'Запрос на получение курсов валют');

  try {
    const rates = await CurrencyRatesTable.findAll(ctx, {
      limit: 10
    });

    Debug.info(ctx, `Найдено курсов валют: ${rates.length}`);
    return rates;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении курсов валют: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_RATES');
    throw error;
  }
});
