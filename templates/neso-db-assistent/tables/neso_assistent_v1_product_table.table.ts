// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentNesoAssistentV1ProductTableL9q = Heap.Table(
  't_templates_neso-db-assistent_neso_assistent_v1_product_table_l9q',
  {
    pid: Heap.Optional(
      Heap.String({
        customMeta: { title: 'Уникальный идентификатор продукта' },
        searchable: { langs: ['ru', 'en'], embeddings: true },
      }),
    ),
    title: Heap.Optional(
      Heap.String({
        customMeta: { title: 'Название продукта' },
        searchable: { langs: ['ru'], embeddings: true },
      }),
    ),
    aliases: Heap.Optional(
      Heap.String({
        customMeta: { title: 'Альтернативные названия или псевдонимы' },
        searchable: { langs: ['ru'], embeddings: true },
      }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Product Table', description: 'Neso Assistant Product Table' } },
)

export default TTemplatesNesoDbAssistentNesoAssistentV1ProductTableL9q

export type TTemplatesNesoDbAssistentNesoAssistentV1ProductTableL9qRow =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1ProductTableL9q.T
export type TTemplatesNesoDbAssistentNesoAssistentV1ProductTableL9qRowJson =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1ProductTableL9q.JsonT
