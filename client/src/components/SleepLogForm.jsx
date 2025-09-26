import { useState } from 'react'
import { api } from '../services/api'

export default function SleepLogForm({ onCreated }) {
  const [sleepStart, setSleepStart] = useState('')
  const [sleepEnd, setSleepEnd] = useState('')
  const [mood, setMood] = useState('neutral')
  const [caffeine, setCaffeine] = useState(0)
  const [disturbances, setDisturbances] = useState(0)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/sleeplogs', { sleepStart, sleepEnd, mood, caffeine: Number(caffeine), disturbances: Number(disturbances), notes })
      setSleepStart(''); setSleepEnd(''); setMood('neutral'); setCaffeine(0); setDisturbances(0); setNotes('')
      onCreated?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save log')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 p-4 border rounded bg-white dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <label className="block text-sm">Sleep start time
          <input className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" type="datetime-local" value={sleepStart} onChange={(e) => setSleepStart(e.target.value)} required />
        </label>
        <label className="block text-sm">Wake-up time
          <input className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" type="datetime-local" value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)} required />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <label className="block text-sm">Mood
          <select className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="very_bad">Very Bad</option>
            <option value="bad">Bad</option>
            <option value="neutral">Neutral</option>
            <option value="good">Good</option>
            <option value="very_good">Very Good</option>
          </select>
        </label>
        <label className="block text-sm">Caffeine (mg)
          <input className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" type="number" min="0" placeholder="e.g. 150" value={caffeine} onChange={(e) => setCaffeine(Number(e.target.value || 0))} />
        </label>
        <label className="block text-sm">Disturbances (count)
          <input className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" type="number" min="0" placeholder="e.g. 2" value={disturbances} onChange={(e) => setDisturbances(Number(e.target.value || 0))} />
        </label>
      </div>
      <label className="block text-sm">Notes
        <textarea className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" placeholder="Optional notes about your sleep" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button className="px-3 py-2 rounded bg-indigo-600 text-white">Add Log</button>
    </form>
  )
}


