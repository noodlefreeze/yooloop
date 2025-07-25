import { atom } from 'jotai'
import { loadable } from 'jotai/utils'

function createVideoIdAtoms(initialValue: string) {
    const baseAtom = atom(initialValue)
    const valueAtom = atom((get) => get(baseAtom))
    const setAtom = atom(null, (_, set, videoId: string) => set(baseAtom, videoId))

    return [valueAtom, setAtom] as const
}

const [videoIdAtom, setVideoIdAtom] = createVideoIdAtoms(getSearchParam('v') as string)

interface Caption {
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
    const baseAtom = atom(0)
    const valueAtom = atom((get) => get(baseAtom))
    const setAtom = atom(null, (get, set, index: number) => {
        const captions = get(captionsAtom)

        if (captions.state === 'hasData' && captions.data.length > index) {
            set(baseAtom, index)
        }
    })

    return [valueAtom, setAtom] as const
}

const [captionIndexAtom, setCaptionIndexAtom] = createCaptionIndexAtoms()

interface Subtitle {
    start: number
    dur: number
    content: string | null
}

const subtitlesBaseAtom = atom(async (get) => {
    const captions = get(captionsAtom)
    const index = get(captionIndexAtom)

    if (captions.state === 'hasData' && captions.data.length > index) {
        const pot = await storage.getItem('local:pot') as string
        const caption = captions.data[index]
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

        const subtitles = await response.json()

        return subtitles
    }

    return []
})
const subtitlesAtom = loadable(subtitlesBaseAtom)

export { captionIndexAtom, captionsAtom, setCaptionIndexAtom, setVideoIdAtom, subtitlesAtom }
