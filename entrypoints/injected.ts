interface InjectedCaption extends Caption {
  url: string
}

export interface VideoWrapperElement extends HTMLDivElement {
  getAudioTrack(): {
    captionTracks: InjectedCaption[]
  }
}

const d = defineUnlistedScript(async () => {
  function getPot() {
    const el = document.querySelector(videoWrapperSelector) as VideoWrapperElement
    const captionTracks = el.getAudioTrack().captionTracks

    if (captionTracks.length === 0) return null

    return new URLSearchParams(captionTracks[0].url).get('pot')
  }

  window.addEventListener('message', (event) => {
    if (event.data?.source !== messageKeys.contentSource) return

    let payload: unknown

    switch (event.data.action) {
      case messageKeys.refreshPot:
        payload = getPot()
        break
      default:
        payload = null
    }

    window.postMessage({ source: messageKeys.injectSource, payload }, window.origin)
  })
})

export default d
