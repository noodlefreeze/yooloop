export const mountElSelector = '#secondary.style-scope.ytd-watch-flexy'
export const videoElSelector = 'video.video-stream.html5-main-video'
export const videoWrapperSelector = '#movie_player'
export const lightOffElSelector = 'yooloop-lights-off'
export const bridgeIframeId = 'bridge-iframe'
export const asShowingClass = 'ad-showing'
export const lightsOffToggleClass = 'lights-off-inactive'

export const videoHeightCSSVariable = '--yooloop-height'

/**
 * Application constants and enums
 */

export const subtitleIdNames = {
  syncVideoTime: 'sync-video-time',
  startLoop: 'start-loop',
  endLoop: 'end-loop',
} as const

export const messageKeys = {
  contentSource: 'yooloop-message-content-source',
  injectSource: 'yooloop-message-inject-source',
  backgroundSource: 'yooloop-message-background-source',
} as const

export const actionKeys = {
  refreshPot: 'refresh-pot',
  openIDBFailed: 'open-idb-failed',
  openIDBSuccess: 'open-idb-success',
  connectIDB: 'connect-idb',
  addShadowing: 'add-shadowing',
  addShadowingAck: 'add-shadowing-ack',
  getAllShadowing: 'get-all-shadowing',
  injectBridgeFrame: 'inject-bridge-iframe',
} as const

export const extensionBcName = 'yooloop-bc'

export type SubtitleIdName = (typeof subtitleIdNames)[keyof typeof subtitleIdNames]
export type MessageKey = (typeof messageKeys)[keyof typeof messageKeys]
export type ActionKey = (typeof actionKeys)[keyof typeof actionKeys]
