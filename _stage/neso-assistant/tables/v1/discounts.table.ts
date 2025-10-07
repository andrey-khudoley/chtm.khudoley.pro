import { Heap } from '@app/heap'

export const NesoAssistentDiscounts = Heap.Table(
  'neso_assistent_discounts_alpha2',
  {
    tid: Heap.Optional(
      Heap.String({ customMeta: { title: 'Tariff ID' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    value: Heap.Optional(
      Heap.Number({ customMeta: { title: 'Discounted Price' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    date_startoff_discount: Heap.Optional(
      Heap.DateTime({
        customMeta: { title: 'Discount Start Date' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
    date_finishoff_discount: Heap.Optional(
      Heap.DateTime({
        customMeta: { title: 'Discount End Date' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Discounts', description: 'Neso Assistant Discounts' } },
)

export default NesoAssistentDiscounts

export type NesoAssistentDiscountsRow =
  typeof NesoAssistentDiscounts.T
export type NesoAssistentDiscountsRowJson =
  typeof NesoAssistentDiscounts.JsonT
