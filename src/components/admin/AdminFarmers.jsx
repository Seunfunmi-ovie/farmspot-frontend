import { useCallback, useEffect, useState } from 'react'
import Notice from '../Notice.jsx'
import { TextInput } from '../Field.jsx'
import { Avatar } from '../Motifs.jsx'
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
      <div className="mb-5 [&>input]:w-full">
        <TextInput placeholder="Search name, username, email or phone" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {error && <Notice notice={{ type: 'error', text: error }} />}

      {!farmers ? (
        <p className="text-inksoft text-sm">Loading farmers…</p>
      ) : shown.length === 0 ? (
        <p className="bg-white rounded-2xl shadow-card p-5 text-sm text-inksoft">No farmers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shown.map(f => {
            const isAdmin = f.role === 'ADMIN'
            const busy = busyId === f.farmerId
            return (
              <div key={f.farmerId} className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={f.fullName} />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{f.fullName}</div>
                      <div className="text-xs text-inksoft">@{f.userName} · {f.phoneNumber}</div>
                    </div>
                  </div>
                  {isAdmin
                    ? <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-field text-white">Admin</span>
                    : f.suspended
                      ? <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-err-bg text-err">Suspended</span>
                      : <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-ok-bg text-field-deep">Active</span>}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-bg rounded-xl py-2.5">
                    <div className="text-sm font-bold">{f.loanCount}</div>
                    <div className="text-[11px] text-inksoft">Loans</div>
                  </div>
                  <div className="bg-bg rounded-xl py-2.5">
                    <div className="text-sm font-bold">{f.farmSizeHectares} ha</div>
                    <div className="text-[11px] text-inksoft">Farm size</div>
                  </div>
                  <div className="bg-bg rounded-xl py-2.5">
                    <div className="text-sm font-bold">{formatMoney(f.balance)}</div>
                    <div className="text-[11px] text-inksoft">Balance</div>
                  </div>
                </div>

                <div className="text-xs text-inksoft">
                  {f.farmLocation || '—'} · {f.email || 'no email'} · joined {formatDate(f.createdAt) || '—'}
                </div>

                {!isAdmin && (
                  <button
                    disabled={busy}
                    onClick={() => toggleSuspension(f)}
                    className={
                      'disabled:opacity-55 font-semibold text-sm py-2.5 rounded-xl transition-colors ' +
                      (f.suspended
                        ? 'bg-field hover:bg-field-deep text-white'
                        : 'border border-err/40 text-err hover:bg-err-bg')
                    }
                  >
                    {busy ? 'Working…' : f.suspended ? 'Reinstate' : 'Suspend'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}