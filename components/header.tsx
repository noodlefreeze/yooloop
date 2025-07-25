import * as Tooltip from '@radix-ui/react-tooltip'
import baseStyle from '~/assets/base.module.scss'
import style from '~/assets/header.module.scss'

export function Header() {
  return (
    <header className={style.header}>
      <div></div>
      <div>
        <Tooltip.Provider delayDuration={700}>
          <LightToggler />
        </Tooltip.Provider>
      </div>
    </header>
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
        <p>Lights {lightsOff ? 'on' : 'off'}</p>
        <Tooltip.Arrow className={baseStyle.tooltipArrow} />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
