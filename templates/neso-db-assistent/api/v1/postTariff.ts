import Tariffs from "../../tables/neso_assistent_v1_tariffs.table";
import Products from "../../tables/neso_assistent_v1_products.table";
import { Debug } from "../../lib/debug.lib";
import { initializeDebug } from "../../lib/getLogLevel";

// @shared-route
export const postTariffRoute = app.post('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/postTariff]");
  Debug.info(ctx, 'Получен запрос на создание/обновление тарифа продукта');

  try {
    // Проверяем database_id
    const databaseId = req.body?.data?.parent?.database_id;
    if (databaseId !== "14d3c77e-0c8b-81b8-8c7d-e144f463d26a") {
      Debug.warn(ctx, `Получен запрос с невалидным database_id: ${databaseId}`);
      return { error: "Invalid database_id" };
    }

    Debug.info(ctx, 'Валидация database_id пройдена');

    const properties = req.body.data.properties;
    if (!properties) {
      Debug.error(ctx, 'Отсутствует объект properties в запросе', 'E_MISSING_PROPERTIES');
      return { error: "Missing properties" };
    }

    // Извлекаем TID из body.data.id
    const tid = req.body.data.id;
    if (!tid) {
      Debug.error(ctx, 'Отсутствует обязательное поле TID (data.id)', 'E_MISSING_TID');
      return { error: "Missing required field: TID" };
    }

    Debug.info(ctx, `Извлечен TID: ${tid}`);

    // Извлекаем название тарифа
    const name = properties.Name?.title?.[0]?.plain_text;
    if (!name) {
      Debug.error(ctx, 'Отсутствует название тарифа (Name)', 'E_MISSING_NAME');
      return { error: "Missing required field: Name" };
    }

    Debug.info(ctx, `Извлечено название тарифа: ${name}`);

    // Извлекаем и обрабатываем PID
    let pidRaw = properties.PID?.rollup?.array?.[0]?.formula?.string;
    if (!pidRaw) {
      Debug.error(ctx, 'Отсутствует обязательное поле PID', 'E_MISSING_PID');
      return { error: "Missing required field: PID" };
    }

    Debug.info(ctx, `Получен сырой PID: ${pidRaw}`);

    // Преобразование PID: "123" -> "NA-A123" или проверка формата "NA-A123"
    let pid: string;
    const numericPattern = /^\d+$/;
    const fullPattern = /^NA-A\d+$/;

    if (numericPattern.test(pidRaw)) {
      // Если пришло только число, добавляем префикс
      pid = `NA-A${pidRaw}`;
      Debug.info(ctx, `PID преобразован из числового формата: ${pidRaw} -> ${pid}`);
    } else if (fullPattern.test(pidRaw)) {
      // Если уже в правильном формате
      pid = pidRaw;
      Debug.info(ctx, `PID уже в правильном формате: ${pid}`);
    } else {
      Debug.error(ctx, `Неверный формат PID: ${pidRaw}. Ожидается число (например, "123") или формат "NA-A123"`, 'E_INVALID_PID_FORMAT');
      return { 
        error: "Invalid PID format", 
        details: "Expected numeric value (e.g., '123') or format 'NA-A[number]'" 
      };
    }

    // Проверяем существование связанного продукта
    Debug.info(ctx, `Поиск связанного продукта с PID: ${pid}`);
    const relatedProduct = await Products.findOneBy(ctx, { pid });
    
    if (!relatedProduct) {
      Debug.error(ctx, `Продукт с PID ${pid} не найден в базе данных`, 'E_PRODUCT_NOT_FOUND');
      return { 
        error: "Related product not found", 
        details: `No product found with PID: ${pid}` 
      };
    }

    Debug.info(ctx, `Связанный продукт найден: ID=${relatedProduct.id}, валюта=${relatedProduct.currency}`);

    // Определяем валюту на основе продукта
    const currency = relatedProduct.currency;
    
    // Извлекаем цену в зависимости от валюты продукта
    let price: number | null = null;
    
    if (currency === "RUB") {
      price = properties["Ввод RUB"]?.number;
      Debug.info(ctx, `Валюта продукта: RUB, извлечена цена: ${price}`);
    } else if (currency === "EUR") {
      price = properties["Ввод EUR"]?.number;
      Debug.info(ctx, `Валюта продукта: EUR, извлечена цена: ${price}`);
    } else {
      Debug.error(ctx, `Неподдерживаемая валюта продукта: ${currency}`, 'E_UNSUPPORTED_CURRENCY');
      return { 
        error: "Unsupported product currency", 
        details: `Product has unsupported currency: ${currency}` 
      };
    }

    // Валидация цены (не должна быть отрицательной)
    if (price === null || price === undefined) {
      Debug.error(ctx, `Отсутствует цена для валюты ${currency}`, 'E_MISSING_PRICE');
      return { 
        error: "Missing price", 
        details: `Price for currency ${currency} is required` 
      };
    }

    if (price < 0) {
      Debug.error(ctx, `Получена отрицательная цена: ${price}`, 'E_NEGATIVE_PRICE');
      return { 
        error: "Invalid price", 
        details: "Price cannot be negative" 
      };
    }

    Debug.info(ctx, `Валидация цены пройдена: ${price} ${currency}`);

    // Создаем или обновляем тариф
    const existingTariff = await Tariffs.findOneBy(ctx, { tid });
    
    const tariffData = {
      tid,
      name,
      pid,
      price
    };

    let tariff;
    if (existingTariff) {
      tariff = await Tariffs.update(ctx, { 
        id: existingTariff.id, 
        ...tariffData 
      });
      Debug.info(ctx, `Тариф обновлен: TID=${tid}, Name=${name}, PID=${pid}, Price=${price}`);
    } else {
      tariff = await Tariffs.create(ctx, tariffData);
      Debug.info(ctx, `Новый тариф создан: TID=${tid}, Name=${name}, PID=${pid}, Price=${price}`);
    }

    Debug.info(ctx, 'Тариф успешно обработан');

    return { 
      success: true, 
      tariff_id: tariff.id,
      tid: tariff.tid,
      name: tariff.name,
      pid: tariff.pid,
      price: tariff.price,
      currency
    };

  } catch (error) {
    Debug.error(ctx, `Внутренняя ошибка сервера: ${error instanceof Error ? error.message : String(error)}`, 'E_INTERNAL');
    return { 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : String(error) 
    };
  }
});