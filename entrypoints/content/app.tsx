import { useAtom } from 'jotai'
import { useEffect } from 'react'
import baseStyle from '~/assets/content/base.module.scss'
import type { AppProps } from '~/types/components'

export default function App(props: AppProps) {
  const { ctx } = props
  const [, setVideoId] = useAtom(setVideoIdAtom)

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
    <ContentScriptLayout>
      <ContentScriptHeader />
      <main className={baseStyle.main}>
        <Subtitles />
      </main>
    </ContentScriptLayout>
  )
}
