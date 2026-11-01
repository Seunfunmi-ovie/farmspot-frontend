import { useCallback, useEffect, useState } from 'react'
import Notice from '../Notice.jsx'
import { TextInput } from '../Field.jsx'
import { Avatar } from '../Motifs.jsx'
import { request } from '../../api.js'
import { formatMoney, formatDate, STATUS } from '../../format.js'

const FILTERS = ['PENDING', 'APPROVED', 'REPAYING', 'DEFAULTED', 'FULLY_REPAID', 'REJECTED', 'ALL']

const LABEL = {
  PENDING: 'Awaiting release',
  APPROVED: 'Approved',
  REPAYING: 'Repaying',
  FULLY_REPAID: 'Fully repaid',
  DEFAULTED: 'Defaulted',
  REJECTED: 'Rejected',
  ALL: 'All'
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

  const primary = 'bg-field hover:bg-field-deep disabled:opacity-55 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors'
  const danger = 'border border-err/40 text-err hover:bg-err-bg disabled:opacity-55 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors'

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 mb-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              'whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-full transition-colors ' +
              (filter === f ? 'bg-field text-white' : 'bg-white text-inksoft shadow-card')
            }
          >
            {LABEL[f]}
          </button>
        ))}
      </div>

      {error && <Notice notice={{ type: 'error', text: error }} />}

      {!loans ? (
        <p className="text-inksoft text-sm">Loading loans…</p>
      ) : loans.length === 0 ? (
        <p className="bg-white rounded-2xl shadow-card p-5 text-sm text-inksoft">No loans match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loans.map(loan => {
            const tone = (STATUS[loan.status] || {}).tone || 'bg-sage text-inksoft'
            const busy = busyId === loan.loanId
            const disbursed = formatDate(loan.disbursementDate)
            return (
              <div key={loan.loanId} className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={loan.farmerName} />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{loan.farmerName}</div>
                      <div className="text-xs text-inksoft">Loan #{loan.loanId} · score {loan.creditScore ?? '—'}</div>
                    </div>
                  </div>
                  <span className={'text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ' + tone}>
                    {LABEL[loan.status] || loan.status}
                  </span>
                </div>

                <div>
                  <div className="text-2xl font-extrabold">{formatMoney(loan.requestedAmount)}</div>
                  <div className="text-xs text-inksoft mt-0.5">
                    {formatMoney(loan.amountRepaid)} repaid{disbursed ? ` · disbursed ${disbursed}` : ''}
                  </div>
                </div>

                {loan.reviewNote && (
                  <div className="text-xs bg-sage rounded-lg px-3 py-2 text-inksoft">Note: {loan.reviewNote}</div>
                )}

                {loan.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button disabled={busy} onClick={() => release(loan)} className={primary + ' grow'}>
                      {busy ? 'Working…' : 'Release funds'}
                    </button>
                    <button disabled={busy} onClick={() => startReview(loan, 'REJECT')} className={danger}>Reject</button>
                  </div>
                )}
                {loan.status === 'REJECTED' && (
                  <button disabled={busy} onClick={() => startReview(loan, 'APPROVE')} className={primary}>
                    Override and approve
                  </button>
                )}

                {reviewing && reviewing.loanId === loan.loanId && (
                  <form onSubmit={submitReview} className="flex flex-col gap-3 border-t border-line pt-3">
                    <span className="text-sm text-inksoft">
                      {reviewing.decision === 'APPROVE' ? 'Reason for overriding the rejection:' : 'Reason for rejecting:'}
                    </span>
                    <div className="[&>input]:w-full">
                      <TextInput required autoFocus value={note} onChange={e => setNote(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                      <button disabled={busy} className={primary}>{busy ? 'Saving…' : 'Confirm'}</button>
                      <button type="button" onClick={() => setReviewing(null)} className="text-sm text-inksoft underline">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}