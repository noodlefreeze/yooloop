/**
 * Core application domain types
 */

export interface AppMetadata {
  videoEl: HTMLVideoElement;
  videoWrapperEl: HTMLDivElement;
  lightsOffEl: HTMLDivElement;
  bridgeIfr?: HTMLIFrameElement;
}

export interface Loop {
  startMs?: number;
  endMs?: number;
  looping: boolean;
}

export interface IDBCRUD {
  addShadowing(): Promise<number>;
}

export type Part = string | boolean | undefined;