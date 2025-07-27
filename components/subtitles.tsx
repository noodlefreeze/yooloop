import { useAtomValue } from 'jotai'
import baseStyle from '~/assets/base.module.scss'
import style from '~/assets/subtitles.module.scss'

export function Subtitles() {
  const [currSubtitles, prevSubtitles] = useAtomValue(subtitlesAtom)

  if (currSubtitles.state === 'hasError') {
    return 'todo: error handler'
  }

  const events =
    currSubtitles.state === 'hasData'
      ? currSubtitles.data.events
      : prevSubtitles?.state === 'hasData'
        ? prevSubtitles.data.events
        : []

  return (
    <section className={bcls(style.subtitles, currSubtitles.state === 'loading' && style.loading)}>
      {currSubtitles.state === 'loading' && <Loading />}
      {events.map((event) => (
        <div className={style.subtitle} key={event.endMs}>
          <div className={style.timestamp}>
            <button className={baseStyle.transitionColors} type="button">
              {formatMillisecondsToHHMMSS(event.startMs)}
            </button>
            <button className={baseStyle.transitionColors} type="button">
              {formatMillisecondsToHHMMSS(event.endMs)}
            </button>
          </div>
          <p>{event.content}</p>
        </div>
      ))}
    </section>
  )
}
