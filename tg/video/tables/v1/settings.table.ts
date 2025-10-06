// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTgVideoV1SettingsTable = Heap.Table(
  't_tg_video_v1_settings_nDil',
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
    videoCounter: Heap.Optional(
      Heap.Number({
        customMeta: { title: 'Счётчик видео' },
      }),
    ),
  },
  { customMeta: { title: 'Настройки сервиса Miniapp Video v1', description: 'Настройки сервиса Miniapp Video v1' } },
)

export default TTgVideoV1SettingsTable

export type TTgVideoV1SettingsTableRow = typeof TTgVideoV1SettingsTable.T
export type TTgVideoV1SettingsTableRowJson = typeof TTgVideoV1SettingsTable.JsonT
