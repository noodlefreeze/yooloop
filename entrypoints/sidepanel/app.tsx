import { useEffect } from 'react'

export function App() {
  useEffect(() => {
    const bc = new BroadcastChannel(extensionBcName)

    bc.onmessage = (message) => {
      console.log(message)
    }
  }, [])

  console.log(1111)
  return <section>11</section>
}
