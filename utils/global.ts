import type { AppMetadata } from '../types/core'

export const appMetadata: AppMetadata = {
  videoEl: null as unknown as HTMLVideoElement,
  videoWrapperEl: null as unknown as HTMLDivElement,
  lightsOffEl: null as unknown as HTMLDivElement,
}

export type { AppMetadata, IDBCRUD } from '../types/core'
export type { IDBMessage } from '../types/messaging'
