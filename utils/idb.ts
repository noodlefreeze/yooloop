import type { Table } from 'dexie'
import Dexie from 'dexie'

interface ShadowingMetadata {
  id?: number
  vid: string
  createdAt: number
}

interface ShadowingAudio {
  id?: number
  metadataId: number
  createdAt: number
  updatedAt: number
  startMs: number
  audio: Blob
  title?: string
}

class ShadowingDB extends Dexie {
  metadata!: Table<ShadowingMetadata, number>
  audio!: Table<ShadowingAudio, number>

  constructor() {
    super('shadowingDB')

    this.version(1).stores({
      shadowingMetadata: '++id, &vid, createdAt',
      shadowingAudio: '++id, metadataId, createdAt, updatedAt, startMs, audio',
    })
    this.metadata = this.table('shadowingMetadata')
    this.audio = this.table('shadowingAudio')
  }

  async addShadowing(vid: string, audioBlob: Blob, startMs: number): Promise<number> {
    return this.transaction('rw', this.metadata, this.audio, async () => {
      let meta = await this.metadata.where('vid').equals(vid).first()

      if (!meta) {
        // create meta record
        const createdAt = Date.now()
        const metadataId = await this.metadata.add({ vid, createdAt })
        meta = { id: metadataId, vid, createdAt }
      }

      // create audio record
      const now = Date.now()
      const audioId = await this.audio.add({
        startMs,
        metadataId: meta.id as number,
        createdAt: now,
        updatedAt: now,
        audio: audioBlob,
      })

      return audioId
    })
  }

  async getAudiosByVid(vid: string): Promise<ShadowingAudio[]> {
    const meta = await this.metadata.where('vid').equals(vid).first()
    if (!meta) return []
    return this.audio
      .where('metadataId')
      .equals(meta.id as number)
      .toArray()
  }

  async getAllMetadataWithAudios(): Promise<(ShadowingMetadata & { audios: Omit<ShadowingAudio, 'audio'>[] })[]> {
    const allMetadata = await this.metadata.toArray()

    return Promise.all(
      allMetadata.map(async (meta) => {
        const audios = await this.audio
          .where('metadataId')
          .equals(meta.id as number)
          .toArray()

        // omit audio
        const audiosWithoutBlob: Omit<ShadowingAudio, 'audio'>[] = audios.map((a) => {
          const { audio, ...rest } = a

          return rest
        })

        return { ...meta, audios: audiosWithoutBlob }
      }),
    )
  }

  async deleteAudio(audioId: number) {
    return this.transaction('rw', this.metadata, this.audio, async () => {
      const audio = await this.audio.get(audioId)
      if (!audio) return 0

      await this.audio.delete(audioId)

      const metadataId = audio.metadataId
      // check if there are any other audio records under this metadata
      const remainingCount = await this.audio.where('metadataId').equals(metadataId).count()
      // if there are no remaining audio records, delete the corresponding metadata
      if (remainingCount === 0) {
        await this.metadata.delete(metadataId)
      }
    })
  }

  async deleteMetadata(metadataId: number) {
    return this.transaction('rw', this.metadata, this.audio, async () => {
      const meta = await this.metadata.get(metadataId)
      if (!meta) return

      // delete audio records
      await this.audio.where('metadataId').equals(metadataId).delete()
      // delete metadata record
      await this.metadata.delete(metadataId)
    })
  }

  async updateAudioTitle(audioId: number, newTitle: string): Promise<boolean> {
    const r = await this.audio.update(audioId, {
      title: newTitle,
      updatedAt: Date.now(),
    })

    return r !== 0
  }
}

export const shadowingDB = new ShadowingDB()
