// biome-ignore assist/source/organizeImports: jotai bug
import { atom } from 'jotai'
import { withHistory } from 'jotai-history'
import { loadable } from 'jotai/utils'

function createVideoIdAtoms(initialValue: string) {
  const baseAtom = atom(initialValue)
  const valueAtom = atom((get) => get(baseAtom))
  const setAtom = atom(null, (_, set, videoId: string) => set(baseAtom, videoId))

  return [valueAtom, setAtom] as const
}

const [videoIdAtom, setVideoIdAtom] = createVideoIdAtoms(getSearchParam('v') as string)

export interface Caption {
  baseUrl: string
  name: {
    simpleText: string
  }
  vssId: string
  languageCode: string
  kind?: string
  isTranslatable: string
  trackName: string
}

const captionsBaseAtom = atom(async (get) => {
  const response = await fetch(`https://www.youtube.com/watch?v=${get(videoIdAtom)}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`failed to fetch captions, response code: ${response.status}`)
  }

  const html = await response.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const scripts = doc.getElementsByTagName('script')

  for (const script of scripts) {
    const content = script.textContent

    if (content?.includes('var ytInitialPlayerResponse')) {
      const startStr = 'captions":'
      const endStr = ',"videoDetails'
      const startIndex = content.indexOf(startStr)
      const endIndex = content.indexOf(endStr)

      if (startIndex !== -1 && endIndex !== -1) {
        const captions = JSON.parse(content.slice(startIndex + startStr.length, endIndex))
          .playerCaptionsTracklistRenderer.captionTracks as Caption[]

        return captions
      }

      break
    }
  }

  return []
})
const captionsAtom = loadable(captionsBaseAtom)

function createCaptionIndexAtoms() {
  const baseAtom = atom<number | null>(null)
  const captionIndexAtom = atom(async (get) => {
    const base = get(baseAtom)

    if (base !== null) {
      return base
    }

    const captions = get(captionsAtom)

    if (captions.state === 'hasData') {
      const index = await getDefaultCaptionIndex(captions.data)

      return index === -1 ? 0 : index
    }

    return 0

  }, (_, set, index: number) => {
    set(baseAtom, index)
  })

  return [captionIndexAtom] as const
}

const [captionIndexAtom] = createCaptionIndexAtoms()

interface Event {
  startMs: number
  endMs: number
  durMs: number
  content: string
}
interface Subtitle {
  events: Event[]
}

interface YTSeg {
  utf8: string
}
interface YTEvent {
  dDurationMs: number
  tStartMs: number
  segs: YTSeg[]
}
interface YTSubtitle {
  events: YTEvent[]
}

const subtitlesBaseAtom = atom(async (get) => {
  const captions = get(captionsAtom)
  const captionIndex = await get(captionIndexAtom)

  if (captions.state === 'hasData' && captionIndex < captions.data.length) {
    const pot = (await storage.getItem('local:pot')) as string
    const caption = captions.data[captionIndex]
    const url = new URL(caption.baseUrl)

    url.searchParams.append('c', 'WEB')
    url.searchParams.append('fmt', 'json3')
    url.searchParams.append('pot', pot)

    const response = await fetch(url.toString(), {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`failed to fetch subtitles, response code: ${response.status}`)
    }

    const ytSubtitles = (await response.json()) as YTSubtitle
    const events: Event[] = []

    ytSubtitles.events.forEach((event) => {
      events.push({
        startMs: event.tStartMs,
        endMs: event.tStartMs + event.dDurationMs,
        durMs: event.dDurationMs,
        content: event.segs.map((seg) => seg.utf8).join(' '),
      })
    })

    const subtitles: Subtitle = { events }

    return subtitles
  }

  return { events: [] }
})
const subtitlesAtom = withHistory(loadable(subtitlesBaseAtom), 2)

export { captionIndexAtom, captionsAtom, setVideoIdAtom, subtitlesAtom }

