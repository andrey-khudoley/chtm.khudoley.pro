import { Heap } from '@app/heap'

export const NesoAssistentProducts = Heap.Table(
  'neso_assistent_products_alpha2',
  {
    pid: Heap.Optional(
      Heap.String({ customMeta: { title: 'Product ID' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
    ),
    speaker: Heap.Optional(
      Heap.String({ customMeta: { title: 'Speaker' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    manager: Heap.Optional(
      Heap.String({ customMeta: { title: 'Manager' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    currency: Heap.Optional(
      Heap.String({ customMeta: { title: 'Currency' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    price: Heap.Optional(
      Heap.Number({ customMeta: { title: 'Price' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    date_startoff_work: Heap.Optional(
      Heap.DateTime({
        customMeta: { title: 'Work Start Date' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
    date_startoff_pr: Heap.Optional(
      Heap.DateTime({ customMeta: { title: 'PR Start Date' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    date_startoff_sale: Heap.Optional(
      Heap.DateTime({
        customMeta: { title: 'Sale Start Date' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
    date_finishoff_work: Heap.Optional(
      Heap.DateTime({
        customMeta: { title: 'Work Finish Date' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
    date_finishoff_pr: Heap.Optional(
      Heap.DateTime({ customMeta: { title: 'PR Finish Date' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    date_finishoff_sale: Heap.Optional(
      Heap.DateTime({
        customMeta: { title: 'Sale Finish Date' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
    is_record: Heap.Optional(
      Heap.Boolean({ customMeta: { title: 'Is Record' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Products', description: 'Neso Assistant Products' } },
)

export default NesoAssistentProducts

export type NesoAssistentProductsRow =
  typeof NesoAssistentProducts.T
export type NesoAssistentProductsRowJson =
  typeof NesoAssistentProducts.JsonT
