/**
 * YouTube API and caption related types
 */

export interface Caption {
  baseUrl: string;
  name: { simpleText: string };
  vssId: string;
  languageCode: string;
  kind?: string;
  isTranslatable: string;
  trackName: string;
}

export interface InjectedCaption extends Caption {
  url: string;
}

export interface subtitleEvent {
  startMs: number;
  endMs: number;
  durMs: number;
  content: string;
  vssId: string;
}

export interface Subtitle {
  events: subtitleEvent[];
}

export interface YTSeg {
  utf8: string;
}

export interface YTEvent {
  dDurationMs: number;
  tStartMs: number;
  segs?: YTSeg[];
}

export interface YTSubtitle {
  events: YTEvent[];
}

export interface VideoWrapperElement extends HTMLDivElement {
  getAudioTrack(): { captionTracks: InjectedCaption[] };
}