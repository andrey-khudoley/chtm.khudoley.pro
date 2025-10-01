// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1ProductTariffsA3xC1W = Heap.Table(
  't_templates_neso-db-assistent_t_templates_neso-db-assistent_neso_assistent_v1_product_tariffs_a3x_C1W',
  {
    tid: Heap.Optional(
      Heap.String({ customMeta: { title: 'Tariff ID' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
    ),
    name: Heap.Optional(
      Heap.String({ customMeta: { title: 'Tariff Name' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
    ),
    pid: Heap.Optional(
      Heap.String({ customMeta: { title: 'Product ID' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
    ),
    price: Heap.Optional(
      Heap.Number({ customMeta: { title: 'Price' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Product Tariffs', description: 'Neso Assistant Product Tariffs' } },
)

export default TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1ProductTariffsA3xC1W

export type TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1ProductTariffsA3xC1WRow =
  typeof TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1ProductTariffsA3xC1W.T
export type TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1ProductTariffsA3xC1WRowJson =
  typeof TTemplatesNesoDbAssistentTTemplatesNesoDbAssistentNesoAssistentV1ProductTariffsA3xC1W.JsonT
