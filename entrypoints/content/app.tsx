import { ContentScriptContext } from '#imports'
import { getSearchParam, isValidVideoUrl } from '@/utils/common'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { captionsAtom, setCaptionIndexAtom, setVideoIdAtom, subtitlesAtom } from './atoms/captions'

interface AppProps {
    ctx: ContentScriptContext
}

export default function App(props: AppProps) {
    const { ctx } = props
    const [, setVideoId] = useAtom(setVideoIdAtom)
    const [captions] = useAtom(captionsAtom)
    const [, setCaptionIndex] = useAtom(setCaptionIndexAtom)
    const [subtitles] = useAtom(subtitlesAtom)

    function handleClick() {
        if (captions.state === 'hasData') {
            setCaptionIndex(Math.floor(Math.random() * captions.data.length))
        }
    }

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
        <section className='dark:text-white'>
            <button onClick={handleClick}>click</button>
        </section>
    )
}
