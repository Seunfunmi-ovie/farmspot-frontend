import { Fragment, useCallback, useEffect, useState } from 'react'
import Notice from '../Notice.jsx'
import { TextInput } from '../Field.jsx'
import { request } from '../../api.js'
import { formatMoney, formatDate, STATUS } from '../../format.js'

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REPAYING', 'DEFAULTED', 'FULLY_REPAID', 'REJECTED']

const LABEL = {
  PENDING: 'Awaiting release',
  APPROVED: 'Approved',
  REPAYING: 'Repaying',
  FULLY_REPAID: 'Fully repaid',
  DEFAULTED: 'Defaulted',
  REJECTED: 'Rejected'
}

export default function AdminLoans({ onChanged }) {
  const [filter, setFilter] = useState('PENDING')
  const [loans, setLoans] = useState(null)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [reviewing, setReviewing] = useState(null) // { loanId, decision }
  const [note, setNote] = useState('')

  const load = useCallback(async () => {
    const res = await request('GET', `/api/admin/loans?status=${filter}`)
    if (!res.ok) return setError(res.message)
    setError(null)
    setLoans(res.data)
  }, [filter])

  useEffect(() => { setLoans(null); load() }, [load])

  async function release(loan) {
    const ok = window.confirm(`Release ${formatMoney(loan.requestedAmount)} to ${loan.farmerName}?`)
    if (!ok) return
    setBusyId(loan.loanId)
    const res = await request('POST', `/api/loans/disbursedLoan/${loan.loanId}`)
    setBusyId(null)
    if (!res.ok) return onChanged({ type: 'error', text: res.message })
    onChanged({ type: 'success', text: `Loan #${loan.loanId} released. ${formatMoney(loan.requestedAmount)} was added to ${loan.farmerName}'s balance.` })
    load()
  }

  function startReview(loan, decision) {
    setReviewing({ loanId: loan.loanId, decision })
    setNote('')
  }

  async function submitReview(e) {
    e.preventDefault()
    setBusyId(reviewing.loanId)
    const res = await request('PUT', `/api/admin/loans/${reviewing.loanId}/review`, {
      decision: reviewing.decision,
      note
    })
    setBusyId(null)
    if (!res.ok) return onChanged({ type: 'error', text: res.message })
    const verb = reviewing.decision === 'APPROVE' ? 'approved and is now awaiting release' : 'rejected'
    onChanged({ type: 'success', text: `Loan #${reviewing.loanId} was ${verb}.` })
    setReviewing(null)
    load()
  }

  const linkBtn = 'text-sm font-semibold underline disabled:opacity-50'

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-inksoft">Show</label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="font-sans text-sm px-3 py-2 border border-line rounded-md bg-white"
        >
          {FILTERS.map(f => <option key={f} value={f}>{f === 'ALL' ? 'All loans' : LABEL[f]}</option>)}
        </select>
        <button onClick={load} className="text-sm text-inksoft underline">Refresh</button>
      </div>

      {error && <Notice notice={{ type: 'error', text: error }} />}

      {!loans ? (
        <p className="text-inksoft text-sm">Loading loans…</p>
      ) : loans.length === 0 ? (
        <p className="text-inksoft text-sm">No loans match this filter.</p>
      ) : (
        <div className="bg-white border border-line rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-sage text-inksoft text-xs">
              <tr>
                <th className="px-4 py-3">Loan</th>
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Repaid</th>
                <th className="px-4 py-3">Disbursed</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => {
                const tone = (STATUS[loan.status] || {}).tone || 'bg-sage text-inksoft'
                const busy = busyId === loan.loanId
                return (
                  <Fragment key={loan.loanId}>
                    <tr className="border-t border-line align-top">
                      <td className="px-4 py-3 whitespace-nowrap">#{loan.loanId}</td>
                      <td className="px-4 py-3">{loan.farmerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatMoney(loan.requestedAmount)}</td>
                      <td className="px-4 py-3">{loan.creditScore ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={'text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ' + tone}>
                          {LABEL[loan.status] || loan.status}
                        </span>
                        {loan.reviewNote && <div className="text-xs text-inksoft mt-1 max-w-[14rem]">Note: {loan.reviewNote}</div>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatMoney(loan.amountRepaid)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(loan.disbursementDate) || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {loan.status === 'PENDING' && (
                          <div className="flex gap-4">
                            <button disabled={busy} onClick={() => release(loan)} className={linkBtn + ' text-field'}>
                              {busy ? 'Working…' : 'Release funds'}
                            </button>
                            <button disabled={busy} onClick={() => startReview(loan, 'REJECT')} className={linkBtn + ' text-err'}>Reject</button>
                          </div>
                        )}
                        {loan.status === 'REJECTED' && (
                          <button disabled={busy} onClick={() => startReview(loan, 'APPROVE')} className={linkBtn + ' text-field'}>
                            Override and approve
                          </button>
                        )}
                      </td>
                    </tr>
                    {reviewing && reviewing.loanId === loan.loanId && (
                      <tr className="bg-paper">
                        <td colSpan={8} className="px-4 py-4">
                          <form onSubmit={submitReview} className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-inksoft">
                              {reviewing.decision === 'APPROVE' ? 'Reason for overriding the rejection:' : 'Reason for rejecting:'}
                            </span>
                            <div className="grow min-w-[16rem] [&>input]:w-full">
                              <TextInput required autoFocus value={note} onChange={e => setNote(e.target.value)} />
                            </div>
                            <button disabled={busy} className="bg-field hover:bg-field-deep disabled:opacity-55 text-bg font-semibold text-sm px-4 py-2.5 rounded-md">
                              {busy ? 'Saving…' : 'Confirm'}
                            </button>
                            <button type="button" onClick={() => setReviewing(null)} className="text-sm text-inksoft underline">Cancel</button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}