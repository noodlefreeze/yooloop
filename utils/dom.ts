
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
  const videoEl = appMetadata.videoEl

  const observer = new ResizeObserver(() => {
    const height = videoEl.style.getPropertyValue('height')
    document.documentElement.style.setProperty(videoHeightCSSVariable, height)
  })

  observer.observe(videoEl)
}

export function createLightsOffEl() {
  const styleEl = document.createElement('style')

  styleEl.innerHTML = `
    .${lightsOffToggleClass} {
      position: unset !important;
    }`
  document.head.appendChild(styleEl)

  const lightsOffEl = document.createElement('div')
  const styles = [
    { property: 'position', value: 'fixed' },
    { property: 'height', value: '100%' },
    { property: 'width', value: '100%' },
    { property: 'z-index', value: '1' },
    { property: 'top', value: '0' },
    { property: 'left', value: '0' },
    { property: 'background-color', value: 'black' },
  ]

  styles.forEach(style => {
    lightsOffEl.style.setProperty(style.property, style.value)
  })
  lightsOffEl.id = lightOffElSelector
  lightsOffEl.classList.add(lightsOffToggleClass)
  appMetadata.videoWrapperEl.appendChild(lightsOffEl)
  appMetadata.lightsOffEl = lightsOffEl
}

export function toggleLights(): 'on' | 'off' {
  const rootEl = document.querySelector<HTMLHtmlElement>('yooloop-ui')?.shadowRoot?.querySelector<HTMLHtmlElement>('html')

  if (!rootEl) return 'on'

  if (appMetadata.lightsOffEl.classList.contains(lightsOffToggleClass)) {
    appMetadata.lightsOffEl.classList.remove(lightsOffToggleClass)
    appMetadata.videoWrapperEl.style.setProperty('z-index', '9999')
    rootEl.style.setProperty('z-index', '9999')
    return 'off'

  } else {
    appMetadata.lightsOffEl.classList.add(lightsOffToggleClass)
    appMetadata.videoWrapperEl.style.setProperty('z-index', '0')
    rootEl.style.setProperty('z-index', '0')

    return 'on'
  }
}
