import CurrencyRates from "../../tables/v1/currency_rates.table";
import { Debug } from "../../lib/debug.lib";
import { initializeDebug } from "../../lib/getLogLevel";

// @shared-route
export const postCurrencyRateRoute = app.post('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/postCurrencyRate]");
  Debug.info(ctx, 'Получен запрос на обновление курса валют');

  try {
    // Проверяем database_id
    const databaseId = req.body?.data?.parent?.database_id;
    if (databaseId !== "14d3c77e-0c8b-8099-a2ac-e66c48fb2aed") {
      Debug.warn(ctx, `Получен запрос с невалидным database_id: ${databaseId}`);
      return { error: "Invalid database_id" };
    }

    Debug.info(ctx, 'Валидация database_id пройдена');

    const properties = req.body.data.properties;
    if (!properties) {
      Debug.error(ctx, 'Отсутствуют properties в запросе', 'E_MISSING_PROPERTIES');
      return { error: "Missing properties" };
    }

    // Извлекаем данные
    Debug.info(ctx, 'Извлечение данных из Notion webhook');
    const currencyName = properties.Name?.title?.[0]?.plain_text;
    const rubRate = properties.RUB?.number;
    const eurRate = properties.EUR?.number;
    const uahRate = properties.UAH?.number;

    // Проверяем наличие имени валюты
    if (!currencyName) {
      Debug.error(ctx, 'Отсутствует название валюты', 'E_MISSING_CURRENCY_NAME');
      return { error: "Missing currency name" };
    }

    Debug.info(ctx, `Обработка курса для валюты: ${currencyName}`);

    // Проверяем наличие всех трёх курсов
    if (rubRate === null || rubRate === undefined || 
        eurRate === null || eurRate === undefined || 
        uahRate === null || uahRate === undefined) {
      Debug.error(ctx, 'Отсутствуют данные по одному или нескольким курсам валют', 'E_MISSING_RATES');
      return { error: "Missing one or more currency rates (RUB, EUR, UAH required)" };
    }

    Debug.info(ctx, `Курсы валют получены: RUB=${rubRate}, EUR=${eurRate}, UAH=${uahRate}`);

    // Проверяем существование записи
    const existingRate = await CurrencyRates.findOneBy(ctx, { currency_name: currencyName });

    const rateData = {
      currency_name: currencyName,
      rub: rubRate,
      eur: eurRate,
      uah: uahRate
    };

    let currencyRate;
    if (existingRate) {
      Debug.info(ctx, `Обновление существующей записи для валюты ${currencyName}`);
      currencyRate = await CurrencyRates.update(ctx, { 
        id: existingRate.id, 
        ...rateData 
      });
      Debug.info(ctx, `Курс валюты обновлен: ${currencyName}`);
    } else {
      Debug.info(ctx, `Создание новой записи для валюты ${currencyName}`);
      currencyRate = await CurrencyRates.create(ctx, rateData);
      Debug.info(ctx, `Новый курс валюты создан: ${currencyName}`);
    }

    Debug.info(ctx, 'Курс валюты успешно обработан');

    return {
      success: true,
      currency_rate_id: currencyRate.id,
      currency_name: currencyRate.currency_name,
      rates: {
        rub: currencyRate.rub,
        eur: currencyRate.eur,
        uah: currencyRate.uah
      }
    };

  } catch (error) {
    Debug.error(ctx, `Внутренняя ошибка сервера: ${error instanceof Error ? error.message : String(error)}`, 'E_INTERNAL');
    return { 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : String(error) 
    };
  }
});