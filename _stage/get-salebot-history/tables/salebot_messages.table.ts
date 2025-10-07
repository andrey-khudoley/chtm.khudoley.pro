// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TemplatesGetSalebotHistorySalebotMessagesFLg = Heap.Table(
  'templates_get-salebot-history_salebot_messages_fLg',
  {
    client_id: Heap.Optional(
      Heap.Number({ customMeta: { title: 'ID клиента' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
    ),
    text: Heap.Optional(
      Heap.String({ customMeta: { title: 'Текст сообщения' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
    ),
    created_date: Heap.Optional(
      Heap.DateTime({
        customMeta: { title: 'Дата создания сообщения' },
        searchable: { langs: ['ru', 'en'], embeddings: true },
      }),
    ),
    delivered: Heap.Optional(
      Heap.Boolean({
        customMeta: { title: 'Доставлено ли сообщение' },
        searchable: { langs: ['ru', 'en'], embeddings: true },
      }),
    ),
    from_client: Heap.Optional(
      Heap.Boolean({
        customMeta: { title: 'От клиента (true) или от нас (false)' },
        searchable: { langs: ['ru', 'en'], embeddings: true },
      }),
    ),
  },
  { customMeta: { title: 'Salebot Messages', description: 'Salebot Messages' } },
)

export default TemplatesGetSalebotHistorySalebotMessagesFLg

export type TemplatesGetSalebotHistorySalebotMessagesFLgRow = typeof TemplatesGetSalebotHistorySalebotMessagesFLg.T
export type TemplatesGetSalebotHistorySalebotMessagesFLgRowJson =
  typeof TemplatesGetSalebotHistorySalebotMessagesFLg.JsonT
