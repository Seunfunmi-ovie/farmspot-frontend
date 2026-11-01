import { useCallback, useEffect, useRef, useState } from 'react'
import Notice from './Notice.jsx'
import LoanCard from './LoanCard.jsx'
import ApplyLoanPanel from './ApplyLoanPanel.jsx'
import ProfilePanel from './ProfilePanel.jsx'
import { WheatField } from './Motifs.jsx'
import { request } from '../api.js'
import { formatMoney } from '../format.js'

const REFRESH_MS = 15000

export default function Dashboard({ farmerId }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [applying, setApplying] = useState(false)
  const [editing, setEditing] = useState(false)
  const seen = useRef(null)

  const load = useCallback(async () => {
    const res = await request('GET', `/api/farmer/${farmerId}/dashboard`)
    if (!res.ok) { setError(res.message); return }
    setError(null)
    setData(res.data)

    // Compare with the last load so changes made elsewhere (disbursement, default) get announced.
    const previous = seen.current
    seen.current = Object.fromEntries(res.data.loans.map(l => [l.loanId, l.status]))
    if (!previous) return

    for (const loan of res.data.loans) {
      const before = previous[loan.loanId]
      if (before === 'PENDING' && loan.status === 'APPROVED') {
        setNotice({
          type: 'success',
          text: `Loan #${loan.loanId} has been disbursed. ${formatMoney(loan.requestedAmount)} was added to your balance.`
        })
      } else if (before && before !== 'DEFAULTED' && loan.status === 'DEFAULTED') {
        setNotice({ type: 'error', text: `Loan #${loan.loanId} is overdue and has been marked as defaulted.` })
      }
    }
  }, [farmerId])

  useEffect(() => {
    load()
    const timer = setInterval(load, REFRESH_MS)
    return () => clearInterval(timer)
  }, [load])

  function handleDone(n) {
    setNotice(n)
    setApplying(false)
    load()
  }

  function handleProfileDone(n) {
    setNotice(n)
    setEditing(false)
    load()
  }

  if (!data) {
    return error
      ? <><Notice notice={{ type: 'error', text: error }} /><button onClick={load} className="text-sm underline">Try again</button></>
      : <p className="text-inksoft">Loading your account…</p>
  }

  const loans = [...data.loans].reverse()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl">Hello, {data.fullName.split(' ')[0]}</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm font-semibold text-field underline">
            Edit profile
          </button>
        )}
      </div>

      {editing && <ProfilePanel farmerId={farmerId} onDone={handleProfileDone} onCancel={() => setEditing(false)} />}

      <div className="relative overflow-hidden bg-field text-bg rounded-lg shadow-card px-8 py-8 mb-8">
        <WheatField className="absolute right-4 bottom-0 h-full text-wheat opacity-[0.16]" />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.16em] text-wheat/80">Account balance</div>
          <div className="font-serif text-5xl text-wheat mt-2">{formatMoney(data.balance)}</div>
        </div>
      </div>

      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl">Your loans</h3>
        {!applying && (
          <button onClick={() => setApplying(true)} className="bg-field hover:bg-field-deep text-bg font-semibold text-sm px-4 py-2.5 rounded-md">
            Apply for a loan
          </button>
        )}
      </div>

      {applying && <ApplyLoanPanel farmerId={farmerId} onDone={handleDone} onCancel={() => setApplying(false)} />}

      <div className="flex flex-col gap-4">
        {loans.length === 0
          ? <p className="text-inksoft text-sm">No loans yet. Apply for your first one above.</p>
          : loans.map(loan => (
              <LoanCard key={loan.loanId} loan={loan} onChanged={n => { if (n) setNotice(n); load() }} />
            ))}
      </div>
    </div>
  )
}