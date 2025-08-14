// biome-ignore assist/source/organizeImports: jotai bug
import { atom, type Getter, type Setter } from 'jotai'
import { withHistory } from 'jotai-history'
import { loadable } from 'jotai/utils'

// videoId atom
function createVideoIdAtoms(initialValue: string) {
  const baseAtom = atom(initialValue)
  const valueAtom = atom((get) => get(baseAtom))
  const setAtom = atom(null, (_, set, videoId: string) => set(baseAtom, videoId))

  return [valueAtom, setAtom] as const
}

const [videoIdAtom, setVideoIdAtom] = createVideoIdAtoms(getSearchParam('v') as string)

// captions atom
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

        return captions.filter((c) => !c.vssId.startsWith('a.'))
      }

      break
    }
  }

  return []
})
const captionsAtom = loadable(captionsBaseAtom)

// captionIndex atom
function createCaptionIndexAtoms() {
  const baseAtom = atom<number | null>(null)
  const captionIndexAtom = atom(
    async (get) => {
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
    },
    (_, set, index: number) => {
      set(baseAtom, index)
    },
  )

  return [captionIndexAtom] as const
}

const [captionIndexAtom] = createCaptionIndexAtoms()

// subtitles atom
export interface subtitleEvent {
  startMs: number
  endMs: number
  durMs: number
  content: string
  vssId: string
}
interface Subtitle {
  events: subtitleEvent[]
}

interface YTSeg {
  utf8: string
}
interface YTEvent {
  dDurationMs: number
  tStartMs: number
  segs?: YTSeg[]
}
interface YTSubtitle {
  events: YTEvent[]
}

const subtitlesBaseAtom = atom(async (get) => {
  const captions = get(captionsAtom)
  const captionIndex = await get(captionIndexAtom)

  if (captions.state === 'hasData' && captionIndex < captions.data.length) {
    let pot = (await getPot()) as string
    // If the POT token is not available, wait until the ad finishes to get it.
    // If the POT token is already available, speed up the ad without waiting.
    if (!pot) {
      await speedAdShowing()
    } else {
      speedAdShowing()
    }
    pot = (await getPot()) as string

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
    const events: subtitleEvent[] = []

    ytSubtitles.events.forEach((event) => {
      if (!event.segs || event.segs.length === 0 || (event.segs.length === 1 && event.segs[0].utf8 === '\n')) return

      events.push({
        startMs: event.tStartMs,
        endMs: event.tStartMs + event.dDurationMs,
        durMs: event.dDurationMs,
        vssId: caption.vssId,
        content: event.segs
          .filter((seg) => seg.utf8 && seg.utf8 !== '\n')
          .map((seg) => seg.utf8)
          .join(' '),
      })
    })

    console.log(events)
    const subtitles: Subtitle = { events }

    return subtitles
  }

  return { events: [] }
})
const subtitlesAtom = withHistory(loadable(subtitlesBaseAtom), 2)

// loop controller atom
interface Loop {
  startMs?: number
  endMs?: number
  looping: boolean
}

function createLoopControllerAtoms() {
  const baseAtom = atom<Loop>({
    startMs: undefined,
    endMs: undefined,
    looping: false,
  })
  const valueAtom = atom((get) => get(baseAtom))
  const setAtom = atom(null, <K extends keyof Loop>(get: Getter, set: Setter, key: K, value: Loop[K]) => {
    const base = get(baseAtom)

    if (base[key] === value) return

    const loop = { ...base, [key]: value }

    if (loop.startMs !== undefined && loop.endMs !== undefined && loop.startMs > loop.endMs) {
      ;[loop.startMs, loop.endMs] = [loop.endMs, loop.startMs]
    }

    set(baseAtom, loop)
  })

  return [valueAtom, setAtom] as const
}

const [loopControllerAtom, setLoopControllerAtom] = createLoopControllerAtoms()

export { captionIndexAtom, captionsAtom, loopControllerAtom, setLoopControllerAtom, setVideoIdAtom, subtitlesAtom }
