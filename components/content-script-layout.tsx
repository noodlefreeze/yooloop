import style from '~/assets/content/layout.module.scss'
import type { LayoutProps } from '~/types/components'

export function ContentScriptLayout(props: LayoutProps) {
  const { children } = props

  return <section className={style.layout}>{children}</section>
}
