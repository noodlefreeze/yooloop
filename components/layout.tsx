import type { ReactNode } from 'react'
import style from '~/assets/layout.module.scss'

interface LayoutProps {
    children: ReactNode
}

export function Layout(props: LayoutProps) {
    const { children } = props

    return (
        <section className={style.layout}>
            {children}
        </section>
    )
}
