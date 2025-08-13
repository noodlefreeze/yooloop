import { useState } from 'react'

export function App() {
  const [shadowings, setShadowings] = useState<Shadowing[]>([])
  const [status, setStatus] = useState<string>('')

  // 连接 IDB
  const handleConnect = async () => {
    const response = await browser.runtime.sendMessage({
      action: actionKeys.connectIDB,
      source: messageKeys.contentSource,
    })
    setStatus(response.success ? (response.message ?? 'connected') : `Error: ${response.message}`)
  }

  // 添加一条 Shadowing
  const handleAdd = async () => {
    const newItem = {
      title: 'Test subtitle',
      startMs: 1000,
      vid: 'video1',
      audio: new Blob(['dummy audio'], { type: 'audio/wav' }),
    }

    const response = await browser.runtime.sendMessage({
      action: actionKeys.addShadowing,
      source: messageKeys.contentSource,
      payload: newItem,
    })
    setStatus(response.success ? `Added ID: ${response.data.id}` : `Error: ${response.error}`)
  }

  // 获取所有 Shadowing
  const handleGetAll = async () => {
    const response = await browser.runtime.sendMessage({
      action: actionKeys.getAllShadowing,
      source: messageKeys.contentSource,
    })
    if (response.success) {
      setShadowings(response.data.shadowing)
      setStatus(`Fetched ${response.data.shadowing.length} items`)
    } else {
      setStatus(`Error: ${response.error}`)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>IndexedDB Test App</h1>
      <div style={{ marginBottom: 10 }}>
        <button type="button" onClick={handleConnect}>
          Connect IDB
        </button>
        <button type="button" onClick={handleAdd}>
          Add Shadowing
        </button>
        <button type="button" onClick={handleGetAll}>
          Get All Shadowings
        </button>
      </div>
      <p>Status: {status}</p>
      <ul>
        {shadowings.map((s) => (
          <li key={s.id}>
            {s.title} - {s.startMs}ms - {s.vid} (Created: {s.createdAt})
          </li>
        ))}
      </ul>
    </div>
  )
}
