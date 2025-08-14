/**
 * Component props and UI related types
 */

import { ContentScriptContext } from '#imports';
import type { ReactNode } from 'react';
import type { subtitleEvent } from './youtube';

export interface LayoutProps {
  children: ReactNode;
}

export interface LoadingProps {
  text?: string;
}

export interface AppProps {
  ctx: ContentScriptContext;
}

export interface SubtitleProps {
  event: subtitleEvent;
  currentPlaying: boolean;
}