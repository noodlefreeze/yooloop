import { ContentScriptContext } from '#imports'
import { isValidVideoUrl } from '@/utils/common'
import { useState } from 'react'

interface AppProps {
    ctx: ContentScriptContext
}

export default function App(props: AppProps) {
    const { ctx } = props
    const [count, setCount] = useState(1)
    const increment = () => setCount((count) => count + 1)

    useEffect(() => {
        ctx.addEventListener(window, 'wxt:locationchange', (event) => {
            if (isValidVideoUrl(event.newUrl.href)) {
                setCount(0)
            }
        })
    }, [])

    return (
        <div className='text-white'>
            <p>This is React. {count}</p>
            <button onClick={increment}>Increment</button>
        </div>
    )
}
