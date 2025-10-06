// This file is auto-generated via createOrUpdateHeapTableFile API and should not be edited manually
import { Heap } from '@app/heap'

export const TTgVideoV1VideosTable = Heap.Table(
  't_tg_video_v1_videos_kSjh',
    {
      videoId: Heap.Optional(
        Heap.String({
          customMeta: { title: 'Уникальный ID видео' },
          searchable: { langs: ['ru', 'en'], embeddings: true },
        }),
      ),
      embedUrl: Heap.Optional(
        Heap.String({
          customMeta: { title: 'URL для встраивания' },
          searchable: { langs: ['ru', 'en'], embeddings: true },
        }),
      ),
      owner: Heap.Optional(Heap.UserRefLink({ customMeta: { title: 'Владелец видео' }, onDelete: 'restrict' })),
      title: Heap.Optional(
        Heap.String({ customMeta: { title: 'Название видео' }, searchable: { langs: ['ru', 'en'], embeddings: true } }),
      ),
    },
    {
      customMeta: {
        title: 'Видео пользователей Miniapp Video v1',
        description: 'Видео пользователей Miniapp Video v1',
      },
    },
  )

export default TTgVideoV1VideosTable

export type TTgVideoV1VideosTableRow = typeof TTgVideoV1VideosTable.T
export type TTgVideoV1VideosTableRowJson = typeof TTgVideoV1VideosTable.JsonT
