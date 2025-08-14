import * as Tooltip from '@radix-ui/react-tooltip'
import { useAtomValue, useSetAtom } from 'jotai'
import baseStyle from '~/assets/content/base.module.scss'
import style from '~/assets/content/header.module.scss'

export function ContentScriptHeader() {
  return (
    <header className={style.header}>
      <Tooltip.Provider delayDuration={200}>
        <div className={style.left}>
          <Captions />
          <LoopController />
        </div>
        <div className={style.right}>
          <ShadowingToggler />
          <LoopToggler />
          <LightToggler />
        </div>
      </Tooltip.Provider>
    </header>
  )
}

function ShadowingToggler() {
  const [startShadowing, setStartShadowing] = useState(false)
  const mediaRecorder = useRef<null | MediaRecorder>(null)

  async function handleClick() {
    setStartShadowing(!startShadowing)

    if (startShadowing) {
      // handle stop shadowing
      if (!mediaRecorder.current) return
      mediaRecorder.current.stop()
      return
    }

    // handle start shadowing
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    if (!stream.active) {
      // do nothing
      return
    }

    const audioChunks: Blob[] = []

    mediaRecorder.current = new MediaRecorder(stream)

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data)
      }
    }
    mediaRecorder.current.onstop = () => {
      const audioType = 'audio/webm'

      new Blob(audioChunks, { type: audioType }).arrayBuffer().then((buffer) => {
        const payload = {
          audioType,
          title: document.title,
          startMs: appMetadata.videoEl.currentTime * 1000,
          vid: getSearchParam('v') as string,
          audio: new Uint8Array(buffer),
        }
        const message = {
          payload,
          source: messageKeys.contentSource,
          action: actionKeys.addShadowing,
        }

        browser.runtime.sendMessage(message)
      })
    }
    mediaRecorder.current.start()
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        onClick={handleClick}
        className={bcls(startShadowing && baseStyle.active, baseStyle.iconBtn, baseStyle.transitionColors)}
      >
        <Mic />
      </Tooltip.Trigger>
      <Tooltip.Content className={baseStyle.tooltipContent}>
        <p>{startShadowing ? 'Stop shadowing' : 'Start shadowing'}</p>
        <Tooltip.Arrow className={baseStyle.tooltipArrow} />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

function LoopToggler() {
  const loopController = useAtomValue(loopControllerAtom)
  const setLoopController = useSetAtom(setLoopControllerAtom)

  const disabled = loopController.startMs === undefined && loopController.endMs === undefined

  function handleClick() {
    if (disabled) {
      return
    }

    setLoopController('looping', !loopController.looping)
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        onClick={handleClick}
        disabled={disabled}
        className={bcls(loopController.looping && baseStyle.active, baseStyle.iconBtn, baseStyle.transitionColors)}
      >
        <Loop />
      </Tooltip.Trigger>
      <Tooltip.Content className={baseStyle.tooltipContent}>
        <p>{disabled ? 'Set a loop point' : loopController.looping ? 'Stop looping' : 'Start looping'}</p>
        <Tooltip.Arrow className={baseStyle.tooltipArrow} />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

function LightToggler() {
  const [lightsOff, setLightsOff] = useState(false)

  function handleClick() {
    setLightsOff(toggleLights() === 'off')
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        onClick={handleClick}
        className={bcls(lightsOff && baseStyle.active, baseStyle.iconBtn, baseStyle.transitionColors)}
      >
        <Light />
      </Tooltip.Trigger>
      <Tooltip.Content className={baseStyle.tooltipContent}>
        <p>Lights {lightsOff ? 'off' : 'on'}</p>
        <Tooltip.Arrow className={baseStyle.tooltipArrow} />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

function LoopController() {
  const loopController = useAtomValue(loopControllerAtom)

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div className={style.loopController}>
          <div className={style.loop}>
            <p className={bcls(style.loopDesc, !!loopController.startMs && style.hasLoopValue)}>start loop</p>
            <p className={style.loopValue}>
              {loopController.startMs ? formatMillisecondsToHHMMSS(loopController.startMs) : null}
            </p>
          </div>
          <div className={style.loop}>
            <p className={bcls(style.loopDesc, !!loopController.endMs && style.hasLoopValue)}>end loop</p>
            <p className={style.loopValue}>
              {loopController.endMs ? formatMillisecondsToHHMMSS(loopController.endMs) : null}
            </p>
          </div>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content className={baseStyle.tooltipContent}>
        <p>Click subtitle's "loop button" to set loop points</p>
        <Tooltip.Arrow className={baseStyle.tooltipArrow} />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
