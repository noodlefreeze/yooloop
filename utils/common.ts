export function isValidVideoUrl(url: string) {
  const standardRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/
  const shortRegex = /^https:\/\/youtu\.be\/[\w-]{11}$/

  return standardRegex.test(url) || shortRegex.test(url)
}

export function getSearchParam(key: string) {
  return new URLSearchParams(location.search).get(key)
}

type Part = string | boolean | undefined

export function bcls(...parts: Part[]) {
  return parts.filter(Boolean).join(' ')
}

export async function getDefaultCaptionIndex(captions: Caption[]) {
  let userPreferred = await storage.getItem<string>('local:preferredLanguage')

  if (!userPreferred) userPreferred = 'en'

  const index = captions.findIndex(caption => caption.languageCode === userPreferred)

  return index === -1 ? 0 : index
}

export function formatMillisecondsToHHMMSS(ms: number, defaultValue: string | undefined = undefined): string | undefined {
  if (!Number.isFinite(ms)) return defaultValue

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const mm = minutes.toString().padStart(2, '0')
  const ss = seconds.toString().padStart(2, '0')

  if (hours === 0) {
    return `${mm}:${ss}`
  }

  const hh = hours.toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

