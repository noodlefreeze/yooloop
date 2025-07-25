import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { ContentScriptContext } from '#imports'
import { getSearchParam, isValidVideoUrl } from '@/utils/common'
import { setVideoIdAtom } from './atoms/captions'

interface AppProps {
  ctx: ContentScriptContext
}

export default function App(props: AppProps) {
  const { ctx } = props
  const [, setVideoId] = useAtom(setVideoIdAtom)
  // const [captions] = useAtom(captionsAtom)
  // const [, setCaptionIndex] = useAtom(setCaptionIndexAtom)
  // const [subtitles] = useAtom(subtitlesAtom)

  // biome-ignore lint/correctness/useExhaustiveDependencies(setVideoId): suppress dependency setVideoId
  // biome-ignore lint/correctness/useExhaustiveDependencies(ctx.addEventListener): suppress dependency ctx.addEventListener
  useEffect(() => {
    async function onLocationChange(_event: unknown) {
      // everyone's happy now!
      const event = _event as WxtWindowEventMap['wxt:locationchange']

      if (isValidVideoUrl(event.newUrl.href)) {
        setVideoId(getSearchParam('v') as string)
      }
    }

    ctx.addEventListener(window, 'wxt:locationchange', onLocationChange)

    return () => {
      window.removeEventListener('wxt:locationchange', onLocationChange)
    }
  }, [])

  return (
    <Layout>
      <Header />
    </Layout>
  )
}

interface LayoutProps {
  children: ReactNode
}

function Layout(props: LayoutProps) {
  const { children } = props

  return (
    <section className="min-w-(--ytd-watch-flexy-sidebar-min-width) max-w-(--ytd-watch-flexy-sidebar-width) h-(--yooloop-height)">
      {children}
    </section>
  )
}

function Header() {
  return <header>11</header>
}
