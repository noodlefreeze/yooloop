export function isValidVideoUrl(url: string) {
    const standardRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/
    const shortRegex = /^https:\/\/youtu\.be\/[\w-]{11}$/

    return standardRegex.test(url) || shortRegex.test(url)
}