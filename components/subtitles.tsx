import { useAtomValue, useSetAtom } from 'jotai'
import { type MouseEvent, memo } from 'react'
import baseStyle from '~/assets/base.module.scss'
import style from '~/assets/subtitles.module.scss'

export function Subtitles() {
  const [currSubtitles, prevSubtitles] = useAtomValue(subtitlesAtom)
  const setLoopController = useSetAtom(setLoopControllerAtom)
  const loopController = useAtomValue(loopControllerAtom)
  const captionsLoader = useAtomValue(captionsAtom)
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
      if (currSubtitles.state !== 'hasData' || appMetadata.videoEl.paused) return

      const currentTime = videoEl.currentTime * 1000
      const events = currSubtitles.data.events

      // skip if ad is showing or video time is before first subtitle
      if (adShowing() || currentTime < events[0].startMs) return

      if (loopController.looping) {
        const { startMs, endMs } = loopController
        const start = startMs ?? 0
        const end = endMs

        if (end !== undefined) {
          if (currentTime > end || currentTime < start) {
            appMetadata.videoEl.currentTime = (start + 1) / 1000
          }
        } else {
          if (currentTime < start) {
            appMetadata.videoEl.currentTime = (start + 1) / 1000
          }
        }
      }

      // skip if current subtitle is still active
      if (events[indexRef.current].startMs <= currentTime && events[indexRef.current].endMs >= currentTime) return

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
  }, [currSubtitles.state, loopController])

  const handleSubtitleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (adShowing()) return

      const target = event.target as HTMLElement

      const syncVideoTime = () => {
        const subtitleEl = target.closest<HTMLDivElement>('div[data-start-ms]')
        if (!subtitleEl) return

        const startMs = subtitleEl.dataset.startMs
        if (!startMs) return

        appMetadata.videoEl.currentTime = parseFloat(startMs) / 1000
      }

      if (target.tagName === 'BUTTON') {
        const id = target.id
        if (!id) return

        if (id === subtitleIdNames.syncVideoTime) {
          syncVideoTime()
        } else {
          const key = id === subtitleIdNames.startLoop ? 'startMs' : id === subtitleIdNames.endLoop ? 'endMs' : null
          if (!key) return

          const dataAttr = target.dataset[key]
          if (!dataAttr) return

          const value = parseFloat(dataAttr)
          if (Number.isNaN(value)) return

          setLoopController(key, value)
        }
      } else {
        syncVideoTime()
      }
    },
    [setLoopController],
  )

  if (currSubtitles.state === 'hasError') {
    console.error(currSubtitles.error)
    return 'todo: error handler'
  }

  const events =
    currSubtitles.state === 'hasData'
      ? currSubtitles.data.events
      : prevSubtitles?.state === 'hasData'
        ? prevSubtitles.data.events
        : []

  // TODO: Refactor this shit...
  return (
    <section className={bcls(style.subtitles, currSubtitles.state === 'loading' && style.loading)}>
      {(currSubtitles.state === 'loading' || captionsLoader.state === 'loading') && (
        <Loading text={adShowing() ? 'Please wait until the ad finishes' : undefined} />
      )}
      {captionsLoader.state === 'hasData' && currSubtitles.state === 'hasData' && events.length === 0 ? (
        <div className={style.emptySubtitles}>
          <p>No subtitles found for this video.</p>
          <p>Auto-generated ones were ignored,</p>
          <p>due to poor timestamp quality.</p>
        </div>
      ) : (
        <div style={{ overflow: 'auto' }} ref={subtitlesRef} aria-hidden onClick={handleSubtitleClick}>
          {events.map((event, i) => (
            <Subtitle key={`${event.durMs}_${event.endMs}_${event.vssId}`} event={event} currentPlaying={i === index} />
          ))}
        </div>
      )}
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
        data-start-ms={event.startMs}
      >
        <div className={style.timestamp}>
          <button id={subtitleIdNames.syncVideoTime} className={baseStyle.transitionColors} type="button">
            {formatMillisecondsToHHMMSS(event.startMs)}
          </button>
          <button
            id={subtitleIdNames.startLoop}
            data-start-ms={event.startMs}
            className={baseStyle.transitionColors}
            type="button"
          >
            start loop
          </button>
          <button
            id={subtitleIdNames.endLoop}
            data-end-ms={event.endMs}
            className={baseStyle.transitionColors}
            type="button"
          >
            end loop
          </button>
        </div>
        <p>{event.content}</p>
      </div>
    )
  },
  (prev, next) => prev.currentPlaying === next.currentPlaying,
)
