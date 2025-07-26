import { useAtom } from 'jotai'
import type { ChangeEvent } from 'react'
import baseStyle from '~/assets/base.module.scss'

export function Captions() {
  const [captionsLoader] = useAtom(captionsAtom)
  const [, setCaptionIndex] = useAtom(setCaptionIndexAtom)

  if (captionsLoader.state === 'hasError') {
    return 'todo: error handler'
  }

  const captions = captionsLoader.state === 'hasData' ? captionsLoader.data : []

  function handleSelect(event: ChangeEvent<HTMLSelectElement>) {
    const value = parseInt(event.target.value)

    setCaptionIndex(value)
  }

  return (
    <Loading loading={captionsLoader.state === 'loading'}>
      <select onChange={handleSelect} className={baseStyle.select} id="captions">
        {captions.map((caption, index) => (
          <option value={index} key={caption.languageCode}>
            {caption.name.simpleText}
          </option>
        ))}
      </select>
    </Loading>
  )
}
