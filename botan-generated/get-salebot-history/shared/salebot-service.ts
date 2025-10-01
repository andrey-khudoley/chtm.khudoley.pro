// @shared
import { request } from '@app/request'
import { Debug } from './debug'
import SalebotMessages from '../tables/salebot_messages.table'

// Конфиг Debug для этого модуля
Debug.configure({ level: 'info', prefix: '[salebot/get_history]' })

// === Константы ===
const SALEBOT_API_KEY: string = 'PASTE_API_KEY_HERE'

// Типы входа/выхода
export type GetHistoryBody = { client_id: number }

// Сообщение из Salebot (сырая форма)
export type SalebotHistoryItem = {
  id: number
  answered: boolean
  client_replica: boolean
  message_id: number | null
  message_from_outside: 0 | 1
  created_at: number | string
  text: string
  attachments: unknown | null
  delivered: boolean
  error_message: string | null
  manager_id?: number | null
  manager_email?: string | null
}

type SuccessResp = { status: 'success'; result: SalebotHistoryItem[] }
type ErrorResp   = { status: 'error'; message: string }
export type SalebotResponse = SuccessResp | ErrorResp

function urlBuilder(clientId: number): string {
  const base = 'https://chatter.salebot.ai/api'
  return `${base}/${SALEBOT_API_KEY}/get_history?client_id=${clientId}`
}

// Извлечь client_id из заранее собранного URL (не меняем payload джобы)
function extractClientIdFromUrl(url: string): number | null {
  const m = url.match(/(?:\?|&)client_id=(\d+)/)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

// Преобразовать created_at (number | string) -> Date
function toDate(value: number | string): Date {
  if (typeof value === 'number') {
    // API присылает unix-seconds (пример: 1587895014)
    return new Date(value * 1000)
  }
  const s = String(value).trim().replace(' ', 'T')
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) {
    // последний шанс — без 'T'
    const d2 = new Date(String(value).trim())
    if (Number.isNaN(d2.getTime())) {
      // если совсем плохо — текущая дата, но логируем
      return new Date()
    }
    return d2
  }
  return d
}

// Узкая рантайм-валидация тела запроса
export function ensureBody(ctx: app.Ctx, b: unknown): asserts b is GetHistoryBody {
  Debug.info(ctx, 'validate body: start')
  let id = (b as any)?.client_id
  
  // Если client_id не является числом - попытайся привести к числу
  if (typeof id !== 'number') {
    const parsedId = Number(id)
    if (!Number.isFinite(parsedId)) {
      Debug.throw(ctx, 'client_id должен быть числом', 'E_BAD_BODY')
    }
    id = parsedId
    // Обновляем значение в объекте
    ;(b as any).client_id = id
  } else if (!Number.isFinite(id)) {
    Debug.throw(ctx, 'client_id должен быть числом', 'E_BAD_BODY')
  }
  
  Debug.info(ctx, 'validate body: ok')
}

// Узкая проверка структуры ответа (строгая проверка status и базовых полей)
function ensureSalebotResponse(ctx: app.Ctx, x: unknown): asserts x is SalebotResponse {
  if (!x || typeof x !== 'object') Debug.throw(ctx, 'Некорректный ответ: не объект', 'E_BAD_RESPONSE')
  const s = (x as any).status
  if (s === 'error') {
    if (typeof (x as any).message !== 'string') Debug.throw(ctx, 'Некорректный error-ответ', 'E_BAD_RESPONSE')
    Debug.warn(ctx, `Salebot вернул статус error: ${(x as any).message}`)
    return
  }
  if (s === 'success') {
    const arr = (x as any).result
    if (!Array.isArray(arr)) Debug.throw(ctx, 'Некорректный success-ответ: result не массив', 'E_BAD_RESPONSE')
    if (arr.length === 0) Debug.warn(ctx, 'Пустая история (result.length = 0)')
    // минимальная проверка элементов
    for (const it of arr) {
      if (!it || typeof it !== 'object') Debug.throw(ctx, 'Элемент result не объект', 'E_BAD_ITEM')
      if (typeof (it as any).id !== 'number') Debug.throw(ctx, 'result.id должен быть числом', 'E_BAD_ITEM')
      if (typeof (it as any).answered !== 'boolean') Debug.throw(ctx, 'result.answered должен быть boolean', 'E_BAD_ITEM')
      if (typeof (it as any).client_replica !== 'boolean') Debug.throw(ctx, 'result.client_replica должен быть boolean', 'E_BAD_ITEM')
      if (!('message_id' in it)) Debug.throw(ctx, 'result.message_id отсутствует', 'E_BAD_ITEM')
      if (!('message_from_outside' in it)) Debug.throw(ctx, 'result.message_from_outside отсутствует', 'E_BAD_ITEM')
      if (!('created_at' in it)) Debug.throw(ctx, 'result.created_at отсутствует', 'E_BAD_ITEM')
      if (typeof (it as any).text !== 'string') Debug.throw(ctx, 'result.text должен быть string', 'E_BAD_ITEM')
      if (typeof (it as any).delivered !== 'boolean') Debug.throw(ctx, 'result.delivered должен быть boolean', 'E_BAD_ITEM')
      if (!('error_message' in it)) Debug.throw(ctx, 'result.error_message отсутствует', 'E_BAD_ITEM')
    }
    Debug.info(ctx, `validate response: ok, items=${arr.length}`)
    return
  }
  Debug.throw(ctx, 'Некорректный ответ: неизвестный status', 'E_BAD_STATUS')
}

// Основная функция получения истории у Salebot
export async function fetchSalebotHistory(ctx: app.Ctx, url: string): Promise<SalebotResponse> {
  Debug.info(ctx, `fetchSalebotHistory: start url=${url}`)
  try {
    const resp = await request.get(url, { responseType: 'json' })
    Debug.info(ctx, 'fetchSalebotHistory: response received')
    const body = resp.body as unknown
    Debug.info(ctx, 'fetchSalebotHistory: validating response')
    ensureSalebotResponse(ctx, body)
    Debug.info(ctx, `fetchSalebotHistory: validated, status=${(body as any).status}`)

    if ((body as any).status === 'success') {
      const messages = (body as SuccessResp).result
      const clientIdFromUrl = extractClientIdFromUrl(url)
      if (clientIdFromUrl == null) Debug.warn(ctx, 'client_id не получен из URL, будет записан 0')

      for (const msg of messages) {
        // Не сохраняем сообщения с ошибкой доставки
        const hasDeliveryError = (msg.delivered === false) || (msg.error_message && msg.error_message !== 'false')
        if (hasDeliveryError) {
          Debug.warn(ctx, `skip message id=${msg.id} due to delivery error`)
          continue
        }

        const exists = await SalebotMessages.findOneBy(ctx, { id: msg.id })
        if (!exists) {
          await SalebotMessages.create(ctx, {
            id: msg.id,
            client_id: clientIdFromUrl ?? 0,
            text: msg.text,
            created_date: toDate(msg.created_at),
            delivered: msg.delivered,
            from_client: msg.client_replica,
          })
          Debug.info(ctx, `inserted message id=${msg.id}`)
        } else {
          Debug.info(ctx, `skip existing message id=${msg.id}`)
        }
      }
    }

    return body as SalebotResponse
  } catch (err) {
    Debug.error(ctx, `fetchSalebotHistory failed: ${String(err)}`, 'E_FETCH')
    throw Debug.throw(ctx, 'Ошибка получения истории у Salebot', 'E_FETCH_THROW')
  }
}

export function buildSalebotUrl(clientId: number): string {
  return urlBuilder(clientId)
}