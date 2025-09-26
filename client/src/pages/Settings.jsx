import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

export default function Settings() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ preferredSleepDurationHours: 8, remindersEnabled: false, reminderTime: '21:30', theme: 'system' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (user?.preferences) setForm(user.preferences)
  }, [user])

  async function save() {
    const { data } = await api.put('/auth/preferences', form)
    setUser(data.user)
    setStatus('Saved!')
    setTimeout(() => setStatus(''), 1500)
  }

  return (
    <div className="max-w-lg">
      <Card>
        <CardHeader title="Settings" />
        <CardContent>
          <div className="space-y-3">
            <label className="block">Preferred Sleep Duration (hours)
              <input className="w-full p-2 border rounded bg-white dark:bg-gray-900" type="number" min="4" max="12" value={form.preferredSleepDurationHours} onChange={(e) => setForm({ ...form, preferredSleepDurationHours: Number(e.target.value) })} />
            </label>
            <label className="block">Reminder Time
              <input className="w-full p-2 border rounded bg-white dark:bg-gray-900" type="time" value={form.reminderTime} onChange={(e) => setForm({ ...form, reminderTime: e.target.value })} />
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.remindersEnabled} onChange={(e) => setForm({ ...form, remindersEnabled: e.target.checked })} /> Enable reminders
            </label>
            <label className="block">Theme
              <select className="w-full p-2 border rounded bg-white dark:bg-gray-900" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <div className="flex items-center gap-2">
              <Button onClick={save}>Save</Button>
              {status && <span className="text-green-600">{status}</span>}
            </div>
          </div>
          <p className="text-sm opacity-70 mt-4">Reminders can be implemented via email/cron or browser notifications in a real deployment.</p>
        </CardContent>
      </Card>
    </div>
  )
}


