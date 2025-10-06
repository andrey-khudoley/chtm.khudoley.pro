// @shared
import CurrencyRatesTable from "../../../tables/v1/currency_rates.table";
import { Debug } from "../../debug.lib";
import { initializeDebug } from "../../getLogLevel";

/**
 * Поддерживаемые валюты для конвертации
 */
export type SupportedCurrency = 'RUB' | 'EUR' | 'USD';

/**
 * Интерфейс данных о курсе валюты из базы данных
 */
export interface CurrencyRateData {
  id: string;
  currency_name: string;
  rub: number;
  eur: number;
  uah: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Результат конвертации валюты
 */
export interface ConversionResult {
  success: boolean;
  sourceCurrency: SupportedCurrency;
  sourceAmount: number;
  conversions: {
    RUB: number;
    EUR: number;
    USD: number;
  };
  timestamp: Date;
  error?: string;
}

/**
 * Ошибка конвертации валюты
 */
export class CurrencyConversionError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = 'CurrencyConversionError';
    this.code = code;
  }
}

/**
 * Получить актуальный курс валюты USD из базы данных
 * @param ctx - контекст приложения
 * @returns Данные о курсе USD или null если не найдено
 */
async function getUSDRate(ctx: app.Ctx): Promise<CurrencyRateData | null> {
  Debug.info(ctx, 'Получение курса USD из базы данных');
  
  try {
    const usdRate = await CurrencyRatesTable.findOneBy(ctx, { 
      currency_name: 'USD' 
    });
    
    if (!usdRate) {
      Debug.warn(ctx, 'Курс USD не найден в базе данных');
      return null;
    }
    
    Debug.info(ctx, `Курс USD получен: RUB=${usdRate.rub}, EUR=${usdRate.eur}`);
    return usdRate;
  } catch (error) {
    Debug.error(
      ctx, 
      `Ошибка при получении курса USD: ${error instanceof Error ? error.message : String(error)}`,
      'E_GET_USD_RATE'
    );
    throw new CurrencyConversionError(
      'Не удалось получить курс валюты из базы данных',
      'E_GET_USD_RATE'
    );
  }
}

/**
 * Валидация входной валюты
 * @param currency - валюта для проверки
 * @returns true если валюта поддерживается
 */
function isValidCurrency(currency: string): currency is SupportedCurrency {
  const validCurrencies: SupportedCurrency[] = ['RUB', 'EUR', 'USD'];
  return validCurrencies.includes(currency.toUpperCase() as SupportedCurrency);
}

/**
 * Валидация входной суммы
 * @param value - сумма для проверки
 * @returns true если сумма валидна
 */
function isValidAmount(value: number): boolean {
  return typeof value === 'number' && 
         !isNaN(value) && 
         isFinite(value) && 
         value > 0;
}

/**
 * Конвертировать валюту в три основные валюты (RUB, EUR, USD)
 * @param ctx - контекст приложения
 * @param sourceCurrency - исходная валюта (RUB, EUR, USD)
 * @param amount - сумма для конвертации
 * @returns Результат конвертации с суммами в трех валютах
 */
export async function convertCurrency(
  ctx: app.Ctx,
  sourceCurrency: string,
  amount: number
): Promise<ConversionResult> {
  await initializeDebug(ctx, "[NeSoAI/currency/convert]");
  
  Debug.info(ctx, `Начало конвертации: ${amount} ${sourceCurrency}`);
  
  // Валидация входных данных
  if (!isValidCurrency(sourceCurrency)) {
    Debug.error(
      ctx, 
      `Неподдерживаемая валюта: ${sourceCurrency}. Поддерживаются: RUB, EUR, USD`,
      'E_INVALID_CURRENCY'
    );
    throw new CurrencyConversionError(
      `Неподдерживаемая валюта: ${sourceCurrency}. Поддерживаются: RUB, EUR, USD`,
      'E_INVALID_CURRENCY'
    );
  }
  
  if (!isValidAmount(amount)) {
    Debug.error(
      ctx,
      `Некорректная сумма для конвертации: ${amount}`,
      'E_INVALID_AMOUNT'
    );
    throw new CurrencyConversionError(
      'Сумма должна быть положительным числом',
      'E_INVALID_AMOUNT'
    );
  }
  
  const normalizedCurrency = sourceCurrency.toUpperCase() as SupportedCurrency;
  Debug.info(ctx, `Валидация пройдена: ${amount} ${normalizedCurrency}`);
  
  try {
    // Получаем курс USD из базы данных
    const usdRate = await getUSDRate(ctx);
    
    if (!usdRate) {
      Debug.error(ctx, 'Курс USD не найден в базе данных', 'E_MISSING_USD_RATE');
      throw new CurrencyConversionError(
        'Курс USD не найден в базе данных. Необходимо загрузить актуальные курсы.',
        'E_MISSING_USD_RATE'
      );
    }
    
    Debug.info(ctx, 'Начало расчета конвертации');
    
    // Курсы относительно USD (1 USD = X валюты)
    const rates = {
      USD: 1,
      RUB: usdRate.rub,
      EUR: usdRate.eur
    };
    
    Debug.info(ctx, `Курсы относительно USD: RUB=${rates.RUB}, EUR=${rates.EUR}`);
    
    // Конвертируем исходную сумму в USD
    let amountInUSD: number;
    
    if (normalizedCurrency === 'USD') {
      amountInUSD = amount;
      Debug.info(ctx, `Исходная валюта USD, сумма: ${amountInUSD}`);
    } else {
      amountInUSD = amount / rates[normalizedCurrency];
      Debug.info(ctx, `Конвертация ${amount} ${normalizedCurrency} в USD: ${amountInUSD}`);
    }
    
    // Конвертируем из USD во все валюты
    const conversions = {
      RUB: amountInUSD * rates.RUB,
      EUR: amountInUSD * rates.EUR,
      USD: amountInUSD
    };
    
    Debug.info(ctx, `Результаты конвертации: RUB=${conversions.RUB.toFixed(2)}, EUR=${conversions.EUR.toFixed(2)}, USD=${conversions.USD.toFixed(2)}`);
    
    const result: ConversionResult = {
      success: true,
      sourceCurrency: normalizedCurrency,
      sourceAmount: amount,
      conversions: {
        RUB: Math.round(conversions.RUB * 100) / 100,
        EUR: Math.round(conversions.EUR * 100) / 100,
        USD: Math.round(conversions.USD * 100) / 100
      },
      timestamp: new Date()
    };
    
    Debug.info(ctx, 'Конвертация успешно завершена');
    
    return result;
    
  } catch (error) {
    if (error instanceof CurrencyConversionError) {
      Debug.error(ctx, `Ошибка конвертации: ${error.message}`, error.code);
      throw error;
    }
    
    Debug.error(
      ctx,
      `Неожиданная ошибка при конвертации: ${error instanceof Error ? error.message : String(error)}`,
      'E_CONVERSION_FAILED'
    );
    
    throw new CurrencyConversionError(
      'Произошла ошибка при конвертации валюты',
      'E_CONVERSION_FAILED'
    );
  }
}

/**
 * Получить актуальные курсы валют
 * @param ctx - контекст приложения
 * @returns Объект с курсами валют
 */
export async function getCurrentRates(ctx: app.Ctx): Promise<{
  USD: { RUB: number; EUR: number };
  timestamp: Date;
} | null> {
  await initializeDebug(ctx, "[NeSoAI/currency/getCurrentRates]");
  
  Debug.info(ctx, 'Получение актуальных курсов валют');
  
  try {
    const usdRate = await getUSDRate(ctx);
    
    if (!usdRate) {
      Debug.warn(ctx, 'Не удалось получить актуальные курсы');
      return null;
    }
    
    const rates = {
      USD: {
        RUB: usdRate.rub,
        EUR: usdRate.eur
      },
      timestamp: usdRate.updatedAt
    };
    
    Debug.info(ctx, 'Актуальные курсы успешно получены');
    
    return rates;
  } catch (error) {
    Debug.error(
      ctx,
      `Ошибка при получении курсов: ${error instanceof Error ? error.message : String(error)}`,
      'E_GET_RATES'
    );
    return null;
  }
}