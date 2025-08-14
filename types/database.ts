/**
 * Database and storage related types
 */

export interface Shadowing {
  title: string;
  startMs: number;
  vid: string;
  audio: Blob;
  id: number;
  createdAt: number;
  updatedAt: number;
}

export type UserShadowing = 'title' | 'startMs' | 'vid' | 'audio';

export interface AddShadowingData {
  title: string;
  startMs: number;
  vid: string;
  audio: ArrayBuffer;
  audioType: string;
}

