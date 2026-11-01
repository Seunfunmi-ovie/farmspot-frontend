import { useCallback, useEffect, useState } from 'react'
import Notice from '../Notice.jsx'
import AdminStats from './AdminStats.jsx'
import AdminLoans from './AdminLoans.jsx'
import AdminFarmers from './AdminFarmers.jsx'
import { request } from '../../api.js'

export default function AdminDashboard() {
  const [tab, setTab] = useState('loans')
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const loadStats = useCallback(async () => {
    const res = await request('GET', '/api/admin/stats')
    if (!res.ok) return setError(res.message)
    setError(null)
    setStats(res.data)
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  // Child tabs call this after any change so the numbers at the top stay current.
  function handleChanged(n) {
    if (n) setNotice(n)
    loadStats()
  }

  const tabClass = active =>
    'pb-2 text-sm border-b-2 ' + (active ? 'border-gold text-field-deep font-semibold' : 'border-transparent text-inksoft')

  return (
    <div>
      <h2 className="text-3xl mb-6">Admin overview</h2>

      {error && <Notice notice={{ type: 'error', text: error }} />}
      <AdminStats stats={stats} />

      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="flex gap-6 mb-5 border-b border-line">
        <button className={tabClass(tab === 'loans')} onClick={() => setTab('loans')}>Loans</button>
        <button className={tabClass(tab === 'farmers')} onClick={() => setTab('farmers')}>Farmers</button>
      </div>

      {tab === 'loans'
        ? <AdminLoans onChanged={handleChanged} />
        : <AdminFarmers onChanged={handleChanged} />}
    </div>
  )
}