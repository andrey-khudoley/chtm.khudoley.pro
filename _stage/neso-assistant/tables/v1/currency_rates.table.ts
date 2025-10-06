// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentNesoAssistentV1CurrencyRatesJwGi = Heap.Table(
  't_templates_neso-db-assistent_neso_assistent_v1_currency_rates_JwGi',
  {
    currency_name: Heap.Optional(
      Heap.String({ customMeta: { title: 'Название валюты' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    rub: Heap.Optional(
      Heap.Number({ customMeta: { title: 'Курс RUB' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    eur: Heap.Optional(
      Heap.Number({ customMeta: { title: 'Курс EUR' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    uah: Heap.Optional(
      Heap.Number({ customMeta: { title: 'Курс UAH' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Currency Rates', description: 'Neso Assistant Currency Rates' } },
)

export default TTemplatesNesoDbAssistentNesoAssistentV1CurrencyRatesJwGi

export type TTemplatesNesoDbAssistentNesoAssistentV1CurrencyRatesC7RRow =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1CurrencyRatesJwGi.T
export type TTemplatesNesoDbAssistentNesoAssistentV1CurrencyRatesC7RRowJson =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1CurrencyRatesJwGi.JsonT

