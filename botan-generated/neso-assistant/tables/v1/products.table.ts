// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentV1ProductsCu3Y = Heap.Table(
  't_templates_neso-db-assistent_v1_products_Cu3Y',
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

export default TTemplatesNesoDbAssistentV1ProductsCu3Y

export type TTemplatesNesoDbAssistentV1ProductsUniqueRow =
  typeof TTemplatesNesoDbAssistentV1ProductsCu3Y.T
export type TTemplatesNesoDbAssistentV1ProductsUniqueRowJson =
  typeof TTemplatesNesoDbAssistentV1ProductsCu3Y.JsonT