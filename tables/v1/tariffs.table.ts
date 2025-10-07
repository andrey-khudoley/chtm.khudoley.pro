import { Heap } from '@app/heap'

export const NesoAssistentTariffs = Heap.Table(
  'neso_assistent_tariffs_alpha2',
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
  { customMeta: { title: 'Neso Assistant Tariffs', description: 'Neso Assistant Tariffs' } },
)

export default NesoAssistentTariffs

export type NesoAssistentTariffsRow =
  typeof NesoAssistentTariffs.T
export type NesoAssistentTariffsRowJson =
  typeof NesoAssistentTariffs.JsonT
