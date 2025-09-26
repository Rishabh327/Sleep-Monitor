import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function BotPanel() {
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/bot/history').then((res) => setHistory(res.data.history || [])).catch(() => {})
  }, [])

  async function send() {
    if (!message.trim()) return
    const userMsg = { role: 'user', content: message }
    setHistory((h) => [...h, userMsg])
    setMessage('')
    setLoading(true)
    try {
      const { data } = await api.post('/bot/ask', { message })
      setHistory((h) => [...h, { role: 'assistant', content: data.reply }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded p-3 bg-white dark:bg-gray-800 flex flex-col h-80">
      <h2 className="font-semibold mb-2">Wellness Bot</h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {history.map((m, idx) => (
          <div key={idx} className={m.role === 'assistant' ? 'text-indigo-600' : ''}>
            <span className="text-xs uppercase opacity-60">{m.role}</span>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input className="flex-1 p-2 border rounded bg-white dark:bg-gray-900" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask for tips..." />
        <button onClick={send} disabled={loading} className="px-3 py-2 rounded bg-indigo-600 text-white">{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  )
}


