import { Heap } from '@app/heap'

export const NesoAssistentSettings = Heap.Table(
  'neso_assistent_settings_alpha2',
  {
    logLevel: Heap.Optional(
      Heap.String({ customMeta: { title: 'Log Level' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Settings', description: 'Neso Assistant Settings' } },
)

export default NesoAssistentSettings

export type NesoAssistentSettingsRow =
  typeof NesoAssistentSettings.T
export type NesoAssistentSettingsRowJson =
  typeof NesoAssistentSettings.JsonT
