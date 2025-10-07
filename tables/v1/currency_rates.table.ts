import { Heap } from '@app/heap'

export const NesoAssistentCurrencyRates = Heap.Table(
  'neso_assistent_currency_rates_alpha2',
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

export default NesoAssistentCurrencyRates

export type NesoAssistentCurrencyRatesRow =
  typeof NesoAssistentCurrencyRates.T
export type NesoAssistentCurrencyRatesRowJson =
  typeof NesoAssistentCurrencyRates.JsonT
