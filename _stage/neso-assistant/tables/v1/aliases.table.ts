import { Heap } from '@app/heap'

export const NesoAssistentAliases = Heap.Table(
  'neso_assistent_aliases_alpha2',
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

export default NesoAssistentAliases

export type NesoAssistentAliasesRow =
  typeof NesoAssistentAliases.T
export type NesoAssistentAliasesRowJson =
  typeof NesoAssistentAliases.JsonT
