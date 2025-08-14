export const mountElSelector = '#secondary.style-scope.ytd-watch-flexy'
export const videoElSelector = 'video.video-stream.html5-main-video'
export const videoWrapperSelector = '#movie_player'
export const lightOffElSelector = 'yooloop-lights-off'
export const bridgeIframeId = 'bridge-iframe'
export const asShowingClass = 'ad-showing'
export const lightsOffToggleClass = 'lights-off-inactive'

export const videoHeightCSSVariable = '--yooloop-height'

export enum subtitleIdNames {
  syncVideoTime = 'sync-video-time',
  startLoop = 'start-loop',
  endLoop = 'end-loop',
}

export enum messageKeys {
  contentSource = 'yooloop-message-content-source',
  injectSource = 'yooloop-message-inject-source',
  backgroundSource = 'yooloop-message-background-source',
}

export enum actionKeys {
  refreshPot = 'refresh-pot',
  openIDBFailed = 'open-idb-failed',
  openIDBSuccess = 'open-idb-success',
  connectIDB = 'connect-idb',
  addShadowing = 'add-shadowing',
  getAllShadowing = 'get-all-shadowing',
  injectBridgeFrame = 'inject-bridge-iframe',
}
