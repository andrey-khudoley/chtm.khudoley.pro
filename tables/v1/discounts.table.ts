// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1DiscountsLBmF = Heap.Table(
  't_templates_neso-db-assistent_t_templates_neso-db-assistent_neso_assistent_v1_discounts_LBmF',
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

export default TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1DiscountsLBmF

export type TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1DiscountsLBmFRow =
  typeof TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1DiscountsLBmF.T
export type TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1DiscountsLBmFRowJson =
  typeof TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1DiscountsLBmF.JsonT

