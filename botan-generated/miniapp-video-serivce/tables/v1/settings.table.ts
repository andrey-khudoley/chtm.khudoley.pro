// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TBotanGeneratedMiniappVideoSerivceMiniappVideoV1SettingsUmF = Heap.Table(
  't_botan-generated_miniapp-video-serivce_miniapp_video_v1_settings_UmF',
  {
    serviceName: Heap.Optional(
      Heap.String({ customMeta: { title: 'Название сервиса' }, searchable: { langs: ['ru', 'en'], embeddings: false } }),
    ),
    logLevel: Heap.Optional(
      Heap.String({
        customMeta: { title: 'Уровень логирования' },
        searchable: { langs: ['ru', 'en'], embeddings: false },
      }),
    ),
  },
  { customMeta: { title: 'Настройки сервиса Miniapp Video v1', description: 'Настройки сервиса Miniapp Video v1' } },
)

export default TBotanGeneratedMiniappVideoSerivceMiniappVideoV1SettingsUmF

export type TBotanGeneratedMiniappVideoSerivceMiniappVideoV1SettingsUmFRow =
  typeof TBotanGeneratedMiniappVideoSerivceMiniappVideoV1SettingsUmF.T
export type TBotanGeneratedMiniappVideoSerivceMiniappVideoV1SettingsUmFRowJson =
  typeof TBotanGeneratedMiniappVideoSerivceMiniappVideoV1SettingsUmF.JsonT
