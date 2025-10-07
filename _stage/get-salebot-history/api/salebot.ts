import { ensureBody, fetchSalebotHistory, buildSalebotUrl } from '../shared/salebot-service'
import { Debug } from '../shared/debug'

// Конфиг Debug для этого модуля
Debug.configure({ level: 'info', prefix: '[salebot/api]' })

// Джоба получения истории у Salebot
const fetchHistoryJob = app.job('/fetchHistory', async (ctx: app.Ctx, payload: { url: string }) => {
  Debug.info(ctx, `fetchHistoryJob: start for url=${payload.url}`)
  try {
    const result = await fetchSalebotHistory(ctx, payload.url)
    Debug.info(ctx, `fetchHistoryJob: completed successfully`)
    return result
  } catch (err) {
    Debug.error(ctx, `fetchHistoryJob failed: ${String(err)}`, 'E_JOB')
    throw err
  }
})

// @shared-route
export const salebotHistoryRoute = app.post('/', async (ctx: app.Ctx, req): Promise<{ scheduled: true; client_id: number }> => {
  Debug.info(ctx, 'POST /: received request')
  const raw = req?.body as unknown
  ensureBody(ctx, raw)
  const { client_id } = raw

  const url = buildSalebotUrl(client_id)
  Debug.info(ctx, `POST /: built url for client_id=${client_id}`)

  // fire-and-forget постановка в очередь + логирование ошибок
  void fetchHistoryJob.scheduleJobAsap(ctx, { url })
    .catch(err => Debug.error(ctx, `schedule failed: ${String(err)}`, 'E_SCHEDULE'))

  Debug.info(ctx, `POST /: job scheduled for client_id=${client_id}`)
  return { scheduled: true, client_id }
})