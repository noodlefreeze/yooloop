import * as Tooltip from '@radix-ui/react-tooltip'
import baseStyle from '~/assets/base.module.scss'
import style from '~/assets/header.module.scss'

export function Header() {
  const [active, setActive] = useState(false)

  return (
    <header className={style.header}>
      <div></div>
      <div>
        <Tooltip.Provider delayDuration={700}>
          <Tooltip.Root>
            <Tooltip.Trigger
              onClick={() => setActive(!active)}
              className={bcls(active && baseStyle.active, baseStyle.iconBtn, baseStyle.transitionColors)}
            >
              <Light />
            </Tooltip.Trigger>
            <Tooltip.Content className={baseStyle.tooltipContent}>
              <p>Lights off</p>
              <Tooltip.Arrow className={baseStyle.tooltipArrow} />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </header>
  )
}
