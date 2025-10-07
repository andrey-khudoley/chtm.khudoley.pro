import Products from "../../tables/v1/products.table";
import { Debug } from "../../lib/debug.lib";
import { initializeDebug } from "../../lib/getLogLevel";

// @shared-route
export const postProductRoute = app.post('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/postProduct]");
  Debug.info(ctx, 'Получен запрос на создание/обновление продукта');

  try {
    // Проверяем database_id
    const databaseId = req.body?.data?.parent?.database_id;
    if (databaseId !== "14d3c77e-0c8b-8114-b763-e545d90f0cc9") {
      Debug.warn(ctx, `Получен запрос с невалидным database_id: ${databaseId}`);
      return { error: "Invalid database_id" };
    }

    Debug.info(ctx, 'Валидация database_id пройдена');

    const properties = req.body.data.properties;
    if (!properties) {
      return { error: "Missing properties" };
    }

    // Извлекаем данные
    Debug.info(ctx, 'Извлечение данных из Notion webhook');
    const pid = properties.ID?.formula?.string;
    const speaker = properties.Спикер?.select?.name;
    const manager = properties.Менеджер?.select?.name;
    const currencyId = properties.Валюта?.relation?.[0]?.id;
    const isRecord = properties["Продажа в записи"]?.checkbox;

    // Определяем валюту
    let currency;
    let priceValue;
    
    if (currencyId === "14e3c77e-0c8b-80d4-93e8-f23a6a5ee77b") {
      currency = "EUR";
      priceValue = properties["Ввод EUR"]?.number;
    } else if (currencyId === "14e3c77e-0c8b-8010-be52-cb46d49c2bd9") {
      currency = "RUB";
      priceValue = properties["Ввод RUB"]?.number;
    } else {
      Debug.error(ctx, 'Некорректная или отсутствующая валюта', 'E_INVALID_CURRENCY');
      return { error: "Invalid or missing currency" };
    }

    // Проверяем наличие цены для указанной валюты
    if (priceValue === null || priceValue === undefined) {
      return { error: "Missing price for specified currency" };
    }

    // Извлекаем даты
    const dateStartoffWork = properties["Дата начала подготовки"]?.date?.start;
    const dateStartoffPr = properties["Дата начала пиара"]?.date?.start;
    const dateStartoffSale = properties["Дата начала продаж"]?.date?.start;
    const dateFinishoffWork = properties["Дата окончания подготовки"]?.date?.start;
    const dateFinishoffPr = properties["Дата окончания пиара"]?.date?.start;
    const dateFinishoffSale = properties["Дата окончания продаж"]?.date?.start;

    // Валидация дат - проверяем что дата окончания не раньше даты начала
    const validateDates = (startDate: string | null, endDate: string | null, fieldName: string) => {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
          throw new Error(`End date cannot be earlier than start date for ${fieldName}`);
        }
      }
    };

    Debug.info(ctx, 'Валидация дат');
    try {
      validateDates(dateStartoffWork, dateFinishoffWork, "work period");
      validateDates(dateStartoffPr, dateFinishoffPr, "PR period");
      validateDates(dateStartoffSale, dateFinishoffSale, "sales period");
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }

    // Проверяем обязательное поле PID
    if (!pid) {
      Debug.error(ctx, 'Отсутствует обязательное поле PID', 'E_MISSING_PID');
      return { error: "Missing required field: PID" };
    }

    // Валидация формата PID (NA-A[число], где число от 1 до 9999)
    const pidPattern = /^NA-A(\d+)$/;
    const pidMatch = pid.match(pidPattern);
    
    if (!pidMatch) {
      Debug.error(ctx, `Неверный формат PID: ${pid}. Ожидается формат NA-A[число], где число от 1 до 9999`, 'E_INVALID_PID_FORMAT');
      return { error: "Invalid PID format. Expected format: NA-A[number], where number is from 1 to 9999" };
    }
    
    const pidNumber = parseInt(pidMatch[1], 10);
    if (pidNumber < 1 || pidNumber > 9999) {
      Debug.error(ctx, `Неверный номер в PID: ${pid}. Номер должен быть от 1 до 9999`, 'E_INVALID_PID_NUMBER');
      return { error: "Invalid PID number. Number must be between 1 and 9999" };
    }
    
    Debug.info(ctx, `Валидация PID пройдена: ${pid}`);

    // Создаем или обновляем продукт
    const existingProduct = await Products.findOneBy(ctx, { pid });
    
    const productData = {
      pid,
      speaker: speaker || null,
      manager: manager || null,
      currency,
      price: priceValue,
      date_startoff_work: dateStartoffWork ? new Date(dateStartoffWork) : null,
      date_startoff_pr: dateStartoffPr ? new Date(dateStartoffPr) : null,
      date_startoff_sale: dateStartoffSale ? new Date(dateStartoffSale) : null,
      date_finishoff_work: dateFinishoffWork ? new Date(dateFinishoffWork) : null,
      date_finishoff_pr: dateFinishoffPr ? new Date(dateFinishoffPr) : null,
      date_finishoff_sale: dateFinishoffSale ? new Date(dateFinishoffSale) : null,
      is_record: isRecord || false
    };

    let product;
    if (existingProduct) {
      product = await Products.update(ctx, { id: existingProduct.id, ...productData });
      Debug.info(ctx, `Продукт обновлен: PID=${pid}`);
    } else {
      product = await Products.create(ctx, productData);
      Debug.info(ctx, `Новый продукт создан: PID=${pid}`);
    }

    Debug.info(ctx, 'Продукт успешно обработан');

    return { 
      success: true, 
      product_id: product.id,
      pid: product.pid
    };

  } catch (error) {
    Debug.error(ctx, `Внутренняя ошибка сервера: ${error instanceof Error ? error.message : String(error)}`, 'E_INTERNAL');
    return { error: "Internal server error", message: error instanceof Error ? error.message : String(error) };
  }
});