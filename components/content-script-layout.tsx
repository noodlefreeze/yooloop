import type { ReactNode } from 'react'
import style from '~/assets/content/layout.module.scss'

interface LayoutProps {
  children: ReactNode
}

export function ContentScriptLayout(props: LayoutProps) {
  const { children } = props

  return <section className={style.layout}>{children}</section>
}
