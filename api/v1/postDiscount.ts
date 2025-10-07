import Discounts from "../../tables/v1/discounts.table";
import Tariffs from "../../tables/v1/tariffs.table";
import Products from "../../tables/v1/products.table";
import { Debug } from "../../lib/debug.lib";
import { initializeDebug } from "../../lib/getLogLevel";

// @shared-route
export const postDiscountRoute = app.post('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/postDiscount]");
  Debug.info(ctx, 'Получен запрос на создание/обновление скидки');

  try {
    // Проверяем database_id
    const databaseId = req.body?.data?.parent?.database_id;
    if (databaseId !== "14d3c77e-0c8b-81ac-b969-c06d4735a3ad") {
      Debug.warn(ctx, `Получен запрос с невалидным database_id: ${databaseId}`);
      return { error: "Invalid database_id" };
    }

    Debug.info(ctx, 'Валидация database_id пройдена');

    const properties = req.body.data.properties;
    if (!properties) {
      Debug.error(ctx, 'Отсутствует объект properties в запросе', 'E_MISSING_PROPERTIES');
      return { error: "Missing properties" };
    }

    // Извлекаем TID из body.data.properties.Тариф.relation[0].id
    const tid = properties["Тариф"]?.relation?.[0]?.id;
    if (!tid) {
      Debug.error(ctx, 'Отсутствует обязательное поле TID (Тариф.relation[0].id)', 'E_MISSING_TID');
      return { error: "Missing required field: TID" };
    }

    Debug.info(ctx, `Извлечен TID: ${tid}`);

    // Находим связанный тариф
    Debug.info(ctx, `Поиск тарифа с TID: ${tid}`);
    const relatedTariff = await Tariffs.findOneBy(ctx, { tid });
    
    if (!relatedTariff) {
      Debug.error(ctx, `Тариф с TID ${tid} не найден в базе данных`, 'E_TARIFF_NOT_FOUND');
      return { 
        error: "Related tariff not found", 
        details: `No tariff found with TID: ${tid}` 
      };
    }

    Debug.info(ctx, `Связанный тариф найден: ID=${relatedTariff.id}, PID=${relatedTariff.pid}`);

    // Находим связанный продукт
    Debug.info(ctx, `Поиск продукта с PID: ${relatedTariff.pid}`);
    const relatedProduct = await Products.findOneBy(ctx, { pid: relatedTariff.pid });
    
    if (!relatedProduct) {
      Debug.error(ctx, `Продукт с PID ${relatedTariff.pid} не найден в базе данных`, 'E_PRODUCT_NOT_FOUND');
      return { 
        error: "Related product not found", 
        details: `No product found with PID: ${relatedTariff.pid}` 
      };
    }

    Debug.info(ctx, `Связанный продукт найден: ID=${relatedProduct.id}, валюта=${relatedProduct.currency}`);

    // Определяем валюту на основе продукта
    const currency = relatedProduct.currency;
    
    // Извлекаем значение скидки в зависимости от валюты продукта
    let value: number | null = null;
    
    if (currency === "RUB") {
      value = properties["Значение RUB"]?.number;
      Debug.info(ctx, `Валюта продукта: RUB, извлечена цена со скидкой: ${value}`);
    } else if (currency === "EUR") {
      value = properties["Значение EUR"]?.number;
      Debug.info(ctx, `Валюта продукта: EUR, извлечена цена со скидкой: ${value}`);
    } else {
      Debug.error(ctx, `Неподдерживаемая валюта продукта: ${currency}`, 'E_UNSUPPORTED_CURRENCY');
      return { 
        error: "Unsupported product currency", 
        details: `Product has unsupported currency: ${currency}` 
      };
    }

    // Валидация значения скидки
    if (value === null || value === undefined) {
      Debug.error(ctx, `Отсутствует значение скидки для валюты ${currency}`, 'E_MISSING_VALUE');
      return { 
        error: "Missing discount value", 
        details: `Discount value for currency ${currency} is required` 
      };
    }

    if (value < 0) {
      Debug.warn(ctx, `Получена отрицательная цена со скидкой: ${value}. Продолжаем обработку.`);
    }

    Debug.info(ctx, `Валидация значения скидки пройдена: ${value} ${currency}`);

    // Извлекаем даты начала и окончания скидки
    const dateStartoffDiscount = properties["Дата начала скидки"]?.date?.start || null;
    const dateFinishoffDiscount = properties["Дата окончания скидки"]?.date?.start || null;

    if (dateStartoffDiscount) {
      Debug.info(ctx, `Дата начала скидки: ${dateStartoffDiscount}`);
    } else {
      Debug.info(ctx, 'Дата начала скидки не указана');
    }

    if (dateFinishoffDiscount) {
      Debug.info(ctx, `Дата окончания скидки: ${dateFinishoffDiscount}`);
    } else {
      Debug.info(ctx, 'Дата окончания скидки не указана');
    }

    // Создаем или обновляем скидку
    const existingDiscount = await Discounts.findOneBy(ctx, { tid });
    
    const discountData = {
      tid,
      value,
      date_startoff_discount: dateStartoffDiscount ? new Date(dateStartoffDiscount) : null,
      date_finishoff_discount: dateFinishoffDiscount ? new Date(dateFinishoffDiscount) : null
    };

    let discount;
    if (existingDiscount) {
      discount = await Discounts.update(ctx, { 
        id: existingDiscount.id, 
        ...discountData 
      });
      Debug.info(ctx, `Скидка обновлена: TID=${tid}, Value=${value}, DateStart=${dateStartoffDiscount || 'null'}, DateEnd=${dateFinishoffDiscount || 'null'}`);
    } else {
      discount = await Discounts.create(ctx, discountData);
      Debug.info(ctx, `Новая скидка создана: TID=${tid}, Value=${value}, DateStart=${dateStartoffDiscount || 'null'}, DateEnd=${dateFinishoffDiscount || 'null'}`);
    }

    Debug.info(ctx, 'Скидка успешно обработана');

    return { 
      success: true, 
      discount_id: discount.id,
      tid: discount.tid,
      value: discount.value,
      currency,
      date_startoff_discount: discount.date_startoff_discount,
      date_finishoff_discount: discount.date_finishoff_discount
    };

  } catch (error) {
    Debug.error(ctx, `Внутренняя ошибка сервера: ${error instanceof Error ? error.message : String(error)}`, 'E_INTERNAL');
    return { 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : String(error) 
    };
  }
});