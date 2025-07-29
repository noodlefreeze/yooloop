import { useAtomValue } from 'jotai'
import { type MouseEvent, memo } from 'react'
import baseStyle from '~/assets/base.module.scss'
import style from '~/assets/subtitles.module.scss'

export function Subtitles() {
  const [currSubtitles, prevSubtitles] = useAtomValue(subtitlesAtom)
  const [index, setIndex] = useState(0)
  const indexRef = useRef<number>(index)
  const subtitlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!subtitlesRef.current) return

    const subtitleEl = subtitlesRef.current.children[index] as HTMLDivElement

    if (!subtitleEl) return

    const containerTop = subtitlesRef.current.scrollTop
    const containerBottom = containerTop + subtitlesRef.current.clientHeight
    const elTop = subtitleEl.offsetTop
    const elBottom = elTop + subtitleEl.clientHeight

    if (elTop < containerTop || elBottom > containerBottom) {
      subtitlesRef.current.scrollTo({
        top: elTop,
        behavior: 'smooth',
      })
    }
  }, [index])

  useEffect(() => {
    if (currSubtitles.state !== 'hasData' || currSubtitles.data.events.length === 0) return

    const videoEl = appMetadata.videoEl

    function onTimestampUpdate() {
      // fuck... it's absolute not necessary
      if (currSubtitles.state !== 'hasData') return

      const currentTime = videoEl.currentTime * 1000
      const events = currSubtitles.data.events

      if (adShowing() || currentTime < events[0].startMs) return

      if (events[indexRef.current].startMs <= currentTime && events[indexRef.current].endMs >= currentTime) {
        return
      }

      let left = 0
      let right = events.length - 1

      while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        if (mid !== indexRef.current && events[mid].startMs <= currentTime && events[mid].endMs >= currentTime) {
          indexRef.current = mid
          setIndex(mid)
          return
        }

        if (events[mid].startMs > currentTime) {
          right = mid - 1
        } else {
          left = mid + 1
        }
      }
    }

    videoEl.addEventListener('timeupdate', onTimestampUpdate)

    return () => {
      videoEl.removeEventListener('timeupdate', onTimestampUpdate)
    }
  }, [currSubtitles.state])

  if (currSubtitles.state === 'hasError') {
    return 'todo: error handler'
  }

  const events =
    currSubtitles.state === 'hasData'
      ? currSubtitles.data.events
      : prevSubtitles?.state === 'hasData'
        ? prevSubtitles.data.events
        : []

  function handleSubtitleClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault()

    const target = event.target as HTMLElement

    if (target.tagName === 'BUTTON') {
    } else {
    }
  }

  return (
    <section className={bcls(style.subtitles, currSubtitles.state === 'loading' && style.loading)}>
      {currSubtitles.state === 'loading' && <Loading />}
      <div style={{ overflow: 'auto' }} ref={subtitlesRef} aria-hidden onClick={handleSubtitleClick}>
        {events.map((event, i) => (
          <Subtitle key={event.endMs} event={event} currentPlaying={i === index} />
        ))}
      </div>
    </section>
  )
}

interface SubtitleProps {
  event: subtitleEvent
  currentPlaying: boolean
}

const Subtitle = memo(
  function Subtitle(props: SubtitleProps) {
    const { event, currentPlaying } = props

    return (
      <div
        className={bcls(style.subtitle, currentPlaying && style.currSubtitle, baseStyle.transitionColors)}
        key={event.endMs}
      >
        <div className={style.timestamp}>
          <button id="start-ms" data-start-ms={event.startMs} className={baseStyle.transitionColors} type="button">
            {formatMillisecondsToHHMMSS(event.startMs)}
          </button>
          <button id="end-ms" data-end-ms={event.endMs} className={baseStyle.transitionColors} type="button">
            {formatMillisecondsToHHMMSS(event.endMs)}
          </button>
        </div>
        <p>{event.content}</p>
      </div>
    )
  },
  (prev, next) => prev.currentPlaying === next.currentPlaying,
)
