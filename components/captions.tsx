import { useAtom } from 'jotai'
import type { ChangeEvent } from 'react'
import baseStyle from '~/assets/base.module.scss'

export function Captions() {
  const [captionsLoader] = useAtom(captionsAtom)
  const [captionIndex, setCaptionIndex] = useAtom(captionIndexAtom)

  if (captionsLoader.state === 'hasError') {
    return 'todo: error handler'
  }

  const captions = captionsLoader.state === 'hasData' ? captionsLoader.data : []

  async function handleSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value)
    const languageCode = event.target.options[value].dataset.languageCode

    await storage.setItem('local:preferredLanguage', languageCode)
    setCaptionIndex(value)
  }

  return (
    <select
      disabled={captionsLoader.state === 'loading'}
      value={captionIndex}
      onChange={handleSelect}
      className={baseStyle.select}
      id="captions"
    >
      {captions.map((caption, index) => (
        <option value={index} key={caption.languageCode} data-language-code={caption.languageCode}>
          {caption.name.simpleText}
        </option>
      ))}
    </select>
  )
}
