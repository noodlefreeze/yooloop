export function isValidVideoUrl(url: string) {
  const standardRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/
  const shortRegex = /^https:\/\/youtu\.be\/[\w-]{11}$/

  return standardRegex.test(url) || shortRegex.test(url)
}

export function getSearchParam(key: string) {
  return new URLSearchParams(location.search).get(key)
}
