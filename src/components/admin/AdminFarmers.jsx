import { useCallback, useEffect, useState } from 'react'
import Notice from '../Notice.jsx'
import { TextInput } from '../Field.jsx'
import { request } from '../../api.js'
import { formatMoney, formatDate } from '../../format.js'

export default function AdminFarmers({ onChanged }) {
  const [farmers, setFarmers] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    const res = await request('GET', '/api/admin/farmers')
    if (!res.ok) return setError(res.message)
    setError(null)
    setFarmers(res.data)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleSuspension(farmer) {
    const suspend = !farmer.suspended
    const ok = window.confirm(
      suspend
        ? `Suspend ${farmer.fullName}? They won't be able to sign in or apply for loans.`
        : `Reinstate ${farmer.fullName}?`
    )
    if (!ok) return
    setBusyId(farmer.farmerId)
    const res = await request('PUT', `/api/admin/farmers/${farmer.farmerId}/suspension`, { suspended: suspend })
    setBusyId(null)
    if (!res.ok) return onChanged({ type: 'error', text: res.message })
    onChanged({ type: 'success', text: `${farmer.fullName} was ${suspend ? 'suspended' : 'reinstated'}.` })
    load()
  }

  const term = search.trim().toLowerCase()
  const shown = (farmers || []).filter(f =>
    !term || [f.fullName, f.userName, f.email, f.phoneNumber].some(v => (v || '').toLowerCase().includes(term))
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-80 max-w-full [&>input]:w-full">
          <TextInput placeholder="Search name, username, email or phone" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={load} className="text-sm text-inksoft underline">Refresh</button>
      </div>

      {error && <Notice notice={{ type: 'error', text: error }} />}

      {!farmers ? (
        <p className="text-inksoft text-sm">Loading farmers…</p>
      ) : shown.length === 0 ? (
        <p className="text-inksoft text-sm">No farmers found.</p>
      ) : (
        <div className="bg-white border border-line rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-sage text-inksoft text-xs">
              <tr>
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Farm</th>
                <th className="px-4 py-3">Loans</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(f => {
                const isAdmin = f.role === 'ADMIN'
                return (
                  <tr key={f.farmerId} className="border-t border-line align-top">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{f.fullName}</div>
                      <div className="text-xs text-inksoft">@{f.userName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{f.phoneNumber}</div>
                      <div className="text-xs text-inksoft">{f.email || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{f.farmLocation || '—'}</div>
                      <div className="text-xs text-inksoft">{f.farmSizeHectares} ha · {f.historicAverageYieldKg} kg</div>
                    </td>
                    <td className="px-4 py-3">{f.loanCount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatMoney(f.balance)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(f.createdAt) || '—'}</td>
                    <td className="px-4 py-3">
                      {isAdmin
                        ? <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gold text-field-deep">Admin</span>
                        : f.suspended
                          ? <span className="text-xs font-semibold px-2 py-1 rounded-md bg-err-bg text-err">Suspended</span>
                          : <span className="text-xs font-semibold px-2 py-1 rounded-md bg-ok-bg text-field-deep">Active</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!isAdmin && (
                        <button
                          disabled={busyId === f.farmerId}
                          onClick={() => toggleSuspension(f)}
                          className={'text-sm font-semibold underline disabled:opacity-50 ' + (f.suspended ? 'text-field' : 'text-err')}
                        >
                          {busyId === f.farmerId ? 'Working…' : f.suspended ? 'Reinstate' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}