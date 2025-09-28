// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentNesoAssistentV1ProductsZ72 = Heap.Table(
  't_templates_neso-db-assistent_neso_assistent_v1_products_z72',
  {
    pid: Heap.Optional(
      Heap.String({ customMeta: { title: 'Product ID' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Products', description: 'Neso Assistant Products' } },
)

export default TTemplatesNesoDbAssistentNesoAssistentV1ProductsZ72

export type TTemplatesNesoDbAssistentNesoAssistentV1ProductsZ72Row =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1ProductsZ72.T
export type TTemplatesNesoDbAssistentNesoAssistentV1ProductsZ72RowJson =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1ProductsZ72.JsonT
