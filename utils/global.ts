interface AppMetadata {
  videoEl: HTMLVideoElement
  videoWrapperEl: HTMLDivElement
  lightsOffEl: HTMLDivElement
  bridgeIfr?: HTMLIFrameElement
}

export const appMetadata: AppMetadata = {
  videoEl: null as unknown as HTMLVideoElement,
  videoWrapperEl: null as unknown as HTMLDivElement,
  lightsOffEl: null as unknown as HTMLDivElement,
}

export interface IDBMessage {
  source: string
  action: string
  payload: Record<string, unknown>
}

export interface IDBCRUD {
  addShadowing(): Promise<number>
}
