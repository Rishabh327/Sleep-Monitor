import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import SleepLogForm from '../components/SleepLogForm.jsx'
import { DurationChart } from '../components/Charts.jsx'
import BotPanel from '../components/BotPanel.jsx'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { MetricSkeleton, ChartSkeleton } from '../components/ui/LoadingSkeleton.jsx'

export default function Dashboard() {
  const [logs, setLogs] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingLog, setEditingLog] = useState(null)
  const [editForm, setEditForm] = useState({
    sleepStart: '',
    sleepEnd: '',
    mood: 'neutral',
    caffeine: 0,
    disturbances: 0,
    notes: ''
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: a }, { data: l }] = await Promise.all([
        api.get('/analysis?days=7'),
        api.get('/sleeplogs'),
      ])
      setAnalysis(a.analysis)
      setLogs(l.logs)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const last7 = useMemo(() => {
    return logs.slice(0, 7).map((l) => ({
      label: new Date(l.sleepStart).toLocaleDateString(),
      hours: (new Date(l.sleepEnd) - new Date(l.sleepStart)) / 36e5,
    })).reverse()
  }, [logs])

  const downloadCsv = useCallback(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.open(`${base}/export/csv`, '_blank')
  }, [])
  const downloadPdf = useCallback(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.open(`${base}/export/pdf`, '_blank')
  }, [])

  const startEdit = useCallback((log) => {
    setEditingLog(log._id)
    setEditForm({
      sleepStart: new Date(log.sleepStart).toISOString().slice(0, 16),
      sleepEnd: new Date(log.sleepEnd).toISOString().slice(0, 16),
      mood: log.mood,
      caffeine: log.caffeine,
      disturbances: log.disturbances,
      notes: log.notes || ''
    })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingLog(null)
    setEditForm({
      sleepStart: '',
      sleepEnd: '',
      mood: 'neutral',
      caffeine: 0,
      disturbances: 0,
      notes: ''
    })
  }, [])

  const saveEdit = useCallback(async () => {
    try {
      await api.put(`/sleeplogs/${editingLog}`, {
        sleepStart: editForm.sleepStart,
        sleepEnd: editForm.sleepEnd,
        mood: editForm.mood,
        caffeine: Number(editForm.caffeine),
        disturbances: Number(editForm.disturbances),
        notes: editForm.notes
      })
      await load() // Reload data
      cancelEdit()
    } catch (err) {
      console.error('Failed to update log:', err)
    }
  }, [editingLog, editForm, load, cancelEdit])

  const deleteLog = useCallback(async (logId) => {
    if (confirm('Are you sure you want to delete this sleep log?')) {
      try {
        await api.delete(`/sleeplogs/${logId}`)
        await load() // Reload data
      } catch (err) {
        console.error('Failed to delete log:', err)
      }
    }
  }, [load])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ChartSkeleton className="md:col-span-2" />
          <ChartSkeleton className="md:col-span-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card><CardContent>
          <div className="text-sm opacity-70">Average Sleep</div>
          <div className="text-3xl font-semibold">{analysis ? `${analysis.averageDurationHours} h` : '--'}</div>
        </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card><CardContent>
          <div className="text-sm opacity-70">Efficiency</div>
          <div className="text-3xl font-semibold">{analysis ? `${analysis.efficiencyPercent}%` : '--'}</div>
        </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card><CardContent>
          <div className="text-sm opacity-70">Flags</div>
          <div>{analysis?.flags?.join(', ') || 'None'}</div>
        </CardContent></Card>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
        <Card className="h-full">
          <CardHeader title="Last 7 Days" action={
            <div className="flex gap-2">
              <Button variant="subtle" onClick={downloadCsv}>Export CSV</Button>
              <Button variant="subtle" onClick={downloadPdf}>Export PDF</Button>
            </div>
          }/>
          <CardContent>
            <DurationChart dataPoints={last7} />
          </CardContent>
        </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="md:col-span-1">
        <Card className="h-full">
          <CardHeader title="Wellness Bot" />
          <CardContent>
            <BotPanel />
          </CardContent>
        </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader title="Add Sleep Log" />
        <CardContent>
          <SleepLogForm onCreated={load} />
        </CardContent>
      </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <Card>
        <CardHeader title="Recent Logs" />
        <CardContent>
          <div className="space-y-2">
            {logs.slice(0, 10).map((l) => (
              <div className="p-3 border rounded-md dark:border-gray-800" key={l._id}>
                {editingLog === l._id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <label className="block text-sm">Sleep start time
                        <input 
                          className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" 
                          type="datetime-local" 
                          value={editForm.sleepStart} 
                          onChange={(e) => setEditForm(prev => ({ ...prev, sleepStart: e.target.value }))} 
                          required 
                        />
                      </label>
                      <label className="block text-sm">Wake-up time
                        <input 
                          className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" 
                          type="datetime-local" 
                          value={editForm.sleepEnd} 
                          onChange={(e) => setEditForm(prev => ({ ...prev, sleepEnd: e.target.value }))} 
                          required 
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <label className="block text-sm">Mood
                        <select 
                          className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" 
                          value={editForm.mood} 
                          onChange={(e) => setEditForm(prev => ({ ...prev, mood: e.target.value }))}
                        >
                          <option value="very_bad">Very Bad</option>
                          <option value="bad">Bad</option>
                          <option value="neutral">Neutral</option>
                          <option value="good">Good</option>
                          <option value="very_good">Very Good</option>
                        </select>
                      </label>
                      <label className="block text-sm">Caffeine (mg)
                        <input 
                          className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" 
                          type="number" 
                          min="0" 
                          placeholder="e.g. 150" 
                          value={editForm.caffeine} 
                          onChange={(e) => setEditForm(prev => ({ ...prev, caffeine: Number(e.target.value || 0) }))} 
                        />
                      </label>
                      <label className="block text-sm">Disturbances (count)
                        <input 
                          className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" 
                          type="number" 
                          min="0" 
                          placeholder="e.g. 2" 
                          value={editForm.disturbances} 
                          onChange={(e) => setEditForm(prev => ({ ...prev, disturbances: Number(e.target.value || 0) }))} 
                        />
                      </label>
                    </div>
                    <label className="block text-sm">Notes
                      <textarea 
                        className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-900" 
                        placeholder="Optional notes about your sleep" 
                        value={editForm.notes} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))} 
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} variant="primary">Save</Button>
                      <Button onClick={cancelEdit} variant="subtle">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm opacity-70">{new Date(l.sleepStart).toLocaleString()} → {new Date(l.sleepEnd).toLocaleString()}</div>
                    <div className="mt-1">Mood: {l.mood} | Caffeine: {l.caffeine}mg | Disturbances: {l.disturbances}</div>
                    {l.notes && <div className="text-sm mt-1 opacity-80">Notes: {l.notes}</div>}
                    <div className="mt-2 flex gap-2">
                      <Button onClick={() => startEdit(l)} variant="subtle" size="sm">Edit</Button>
                      <Button onClick={() => deleteLog(l._id)} variant="subtle" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}


