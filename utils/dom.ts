export function waitForElement(selector: string) {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector)

      if (el) {
        observer.disconnect()
        resolve(void 0)
      }
    })

    observer.observe(document.body, {
      childList: true,
    })

    setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element "${selector}" was not found within 10 seconds`))
    }, 1000 * 10)
  })
}

export function syncVideoElHeight() {
  const videoEl = document.querySelector(videoElSelector) as HTMLVideoElement

  const observer = new ResizeObserver(() => {
    const height = videoEl.style.getPropertyValue('height')
    document.documentElement.style.setProperty(videoHeightCSSVariable, height)
  })

  observer.observe(videoEl)
}
