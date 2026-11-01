import { useCallback, useEffect, useState } from 'react'
import Notice from '../Notice.jsx'
import AdminStats from './AdminStats.jsx'
import AdminLoans from './AdminLoans.jsx'
import AdminFarmers from './AdminFarmers.jsx'
import { request } from '../../api.js'

export default function AdminDashboard({ tab, onTab }) {
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

  // Child screens call this after any change so the overview numbers stay current.
  function handleChanged(n) {
    if (n) setNotice(n)
    loadStats()
  }

  return (
    <div>
      {error && <Notice notice={{ type: 'error', text: error }} />}
      <Notice notice={notice} onClose={() => setNotice(null)} />

      {tab === 'overview' && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold">Admin overview</h2>
            <p className="text-sm text-inksoft mt-0.5">How FarmsPot is doing right now.</p>
          </div>
          <AdminStats stats={stats} onTab={onTab} />
        </>
      )}

      {tab === 'loans' && (
        <>
          <h2 className="text-2xl font-extrabold mb-5">Loans</h2>
          <AdminLoans onChanged={handleChanged} />
        </>
      )}

      {tab === 'farmers' && (
        <>
          <h2 className="text-2xl font-extrabold mb-5">Farmers</h2>
          <AdminFarmers onChanged={handleChanged} />
        </>
      )}
    </div>
  )
}
