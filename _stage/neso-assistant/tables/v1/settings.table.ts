// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTemplatesNesoDbAssistentNesoAssistentV1SettingsMtA3 = Heap.Table(
  't_templates_neso-db-assistent_neso_assistent_v1_settings_MtA3',
  {
    logLevel: Heap.Optional(
      Heap.String({ customMeta: { title: 'Log Level' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
  },
  { customMeta: { title: 'Neso Assistant Settings', description: 'Neso Assistant Settings' } },
)

export default TTemplatesNesoDbAssistentNesoAssistentV1SettingsMtA3

export type TTemplatesNesoDbAssistentNesoAssistentV1Settings4NuRow =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1SettingsMtA3.T
export type TTemplatesNesoDbAssistentNesoAssistentV1Settings4NuRowJson =
  typeof TTemplatesNesoDbAssistentNesoAssistentV1SettingsMtA3.JsonT

