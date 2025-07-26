// biome-ignore assist/source/organizeImports: biome bug
import type { ContentScriptContext } from '#imports'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

interface AppProps {
  ctx: ContentScriptContext
}

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
    <Layout>
      <Header />
    </Layout>
  )
}
