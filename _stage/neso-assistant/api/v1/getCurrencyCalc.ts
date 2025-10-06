import { convertCurrency, CurrencyConversionError } from "../../lib/core/currency/convert";
import { Debug } from "../../lib/debug.lib";
import { initializeDebug } from "../../lib/getLogLevel";

/**
 * API эндпоинт для конвертации валют
 * 
 * GET /api/v1/getCurrencyCalc?currency=rub&value=1000
 * 
 * Query параметры:
 * - currency: строка, валюта (rub/eur/usd)
 * - value: число, сумма для конвертации
 * 
 * Возвращает JSON с результатами конвертации в трех валютах
 */

// @shared-route
export const getCurrencyCalcRoute = app.get('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/api/getCurrencyCalc]");
  
  Debug.info(ctx, 'Получен запрос на конвертацию валюты');
  
  try {
    // Извлечение параметров запроса
    const currencyParam = req.query.currency;
    const valueParam = req.query.value;
    
    Debug.info(ctx, `Параметры запроса: currency=${currencyParam}, value=${valueParam}`);
    
    // Валидация наличия параметров
    if (!currencyParam) {
      Debug.warn(ctx, 'Отсутствует обязательный параметр: currency');
      return {
        success: false,
        error: 'Отсутствует обязательный параметр: currency',
        code: 'E_MISSING_CURRENCY_PARAM',
        usage: {
          method: 'GET',
          endpoint: '/api/v1/getCurrencyCalc',
          queryParams: {
            currency: 'rub|eur|usd',
            value: 'number (положительное число)'
          },
          example: '/api/v1/getCurrencyCalc?currency=rub&value=1000'
        }
      };
    }
    
    if (!valueParam) {
      Debug.warn(ctx, 'Отсутствует обязательный параметр: value');
      return {
        success: false,
        error: 'Отсутствует обязательный параметр: value',
        code: 'E_MISSING_VALUE_PARAM',
        usage: {
          method: 'GET',
          endpoint: '/api/v1/getCurrencyCalc',
          queryParams: {
            currency: 'rub|eur|usd',
            value: 'number (положительное число)'
          },
          example: '/api/v1/getCurrencyCalc?currency=rub&value=1000'
        }
      };
    }
    
    Debug.info(ctx, 'Валидация наличия параметров пройдена');
    
    // Парсинг и валидация значения
    const value = parseFloat(valueParam as string);
    
    if (isNaN(value) || !isFinite(value)) {
      Debug.warn(ctx, `Некорректное значение параметра value: ${valueParam}`);
      return {
        success: false,
        error: 'Параметр value должен быть числом',
        code: 'E_INVALID_VALUE_FORMAT',
        received: valueParam
      };
    }
    
    if (value <= 0) {
      Debug.warn(ctx, `Отрицательное или нулевое значение: ${value}`);
      return {
        success: false,
        error: 'Параметр value должен быть положительным числом',
        code: 'E_INVALID_VALUE_RANGE',
        received: value
      };
    }
    
    Debug.info(ctx, `Валидация значения пройдена: ${value}`);
    
    // Нормализация валюты (приведение к верхнему регистру)
    const currency = (currencyParam as string).toUpperCase();
    
    Debug.info(ctx, `Нормализованная валюта: ${currency}`);
    
    // Выполнение конвертации
    Debug.info(ctx, `Вызов функции конвертации: ${value} ${currency}`);
    
    const result = await convertCurrency(ctx, currency, value);
    
    Debug.info(ctx, 'Конвертация успешно выполнена');
    
    // Формирование ответа
    const response = {
      success: true,
      request: {
        currency: result.sourceCurrency,
        value: result.sourceAmount
      },
      result: {
        RUB: result.conversions.RUB,
        EUR: result.conversions.EUR,
        USD: result.conversions.USD
      },
      timestamp: result.timestamp.toISOString()
    };
    
    Debug.info(ctx, `Ответ сформирован: RUB=${response.result.RUB}, EUR=${response.result.EUR}, USD=${response.result.USD}`);
    
    return response;
    
  } catch (error) {
    // Обработка специфичных ошибок конвертации
    if (error instanceof CurrencyConversionError) {
      Debug.error(
        ctx,
        `Ошибка конвертации валюты: ${error.message}`,
        error.code
      );
      
      return {
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      };
    }
    
    // Обработка неожиданных ошибок
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    Debug.error(
      ctx,
      `Внутренняя ошибка сервера: ${errorMessage}`,
      'E_INTERNAL_SERVER_ERROR'
    );
    
    return {
      success: false,
      error: 'Внутренняя ошибка сервера',
      code: 'E_INTERNAL_SERVER_ERROR',
      details: errorMessage,
      timestamp: new Date().toISOString()
    };
  }
});