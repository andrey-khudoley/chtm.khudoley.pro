// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentV1AliasesrAmg = Heap.Table(
  't_templates_neso-db-assistent_v1_aliases_rAmg',
  {
    alias_norm: Heap.Optional(
      Heap.String({
        customMeta: { title: 'Normalized canonical alias' },
        searchable: { langs: ['ru', 'en'], embeddings: true },
      }),
    ),
    pid: Heap.Optional(
      Heap.String({
        customMeta: { title: 'Product ID reference' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
    aliases: Heap.Optional(Heap.Any()),
    weight: Heap.Optional(
      Heap.Number({
        customMeta: { title: 'Alias priority weight for collision resolution' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
    is_official: Heap.Optional(
      Heap.Boolean({
        customMeta: { title: 'Official product name flag' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Aliases', description: 'Neso Assistant Aliases' } },
)

export default TTemplatesNesoDbAssistentV1AliasesrAmg

export type TTemplatesNesoDbAssistentV1AliasesRow =
  typeof TTemplatesNesoDbAssistentV1AliasesrAmg.T
export type TTemplatesNesoDbAssistentV1AliasesRowJson =
  typeof TTemplatesNesoDbAssistentV1AliasesrAmg.JsonT

