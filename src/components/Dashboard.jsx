import { useCallback, useEffect, useRef, useState } from 'react'
import Notice from './Notice.jsx'
import LoanCard from './LoanCard.jsx'
import ApplyLoanPanel from './ApplyLoanPanel.jsx'
import ProfilePanel from './ProfilePanel.jsx'
import { WheatField, Avatar } from './Motifs.jsx'
import { WalletIcon, UserIcon, PlusIcon, LogoutIcon } from './Icons.jsx'
import { request } from '../api.js'
import { formatMoney } from '../format.js'

const REFRESH_MS = 15000

export default function Dashboard({ farmerId, userName, tab, onTab, onSignOut }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [applying, setApplying] = useState(false)
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

  function startApply() {
    setApplying(true)
    onTab('loans')
  }

  function handleApplied(n) {
    setNotice(n)
    setApplying(false)
    load()
  }

  function handleProfileDone(n) {
    setNotice(n)
    load()
  }

  if (!data) {
    return error
      ? <><Notice notice={{ type: 'error', text: error }} /><button onClick={load} className="text-sm font-semibold text-field underline">Try again</button></>
      : <p className="text-inksoft">Loading your account…</p>
  }

  const loans = [...data.loans].reverse()
  const first = data.fullName.split(' ')[0]
  const activeCount = loans.filter(l => l.status === 'APPROVED' || l.status === 'REPAYING').length
  const repaidTotal = loans.reduce((sum, l) => sum + (l.amountRepaid || 0), 0)

  return (
    <div>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      {tab === 'home' && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-extrabold">Hi, {first}</h2>
            <p className="text-sm text-inksoft mt-0.5">Here is how your farm account is doing.</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-field to-field-deep text-white p-6 shadow-card">
            <WheatField className="absolute right-2 bottom-0 h-full text-white opacity-[0.13]" />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-widest text-wheat">Account balance</div>
              <div className="text-3xl sm:text-4xl font-extrabold mt-2">{formatMoney(data.balance)}</div>
              <div className="flex gap-3 mt-5">
                <div className="bg-white/15 rounded-2xl px-4 py-2.5">
                  <div className="text-lg font-bold leading-none">{activeCount}</div>
                  <div className="text-[11px] text-wheat mt-1">Active loans</div>
                </div>
                <div className="bg-white/15 rounded-2xl px-4 py-2.5">
                  <div className="text-lg font-bold leading-none">{formatMoney(repaidTotal)}</div>
                  <div className="text-[11px] text-wheat mt-1">Repaid so far</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-field-deep text-white p-6">
            <span className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gold/90" />
            <span className="absolute right-6 top-10 w-16 h-16 rounded-full bg-gold/40" />
            <div className="relative max-w-[70%]">
              <div className="text-xs font-bold uppercase tracking-widest text-wheat">Pay after you sell</div>
              <p className="text-sm mt-2 text-white/90">Get the funds for your farm now and repay from your harvest.</p>
              <button onClick={startApply} className="mt-4 bg-white text-field-deep font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-wheat transition-colors">
                Apply now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ['Apply', PlusIcon, startApply],
              ['My loans', WalletIcon, () => onTab('loans')],
              ['Profile', UserIcon, () => onTab('profile')]
            ].map(([label, Icon, action]) => (
              <button key={label} onClick={action} className="bg-white rounded-2xl shadow-card py-4 flex flex-col items-center gap-2 text-xs font-semibold hover:bg-field-soft transition-colors">
                <span className="w-11 h-11 rounded-full bg-field-soft text-field flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                {label}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Latest loan</h3>
              {loans.length > 1 && (
                <button onClick={() => onTab('loans')} className="text-sm font-semibold text-field">See all</button>
              )}
            </div>
            {loans.length === 0
              ? <p className="bg-white rounded-2xl shadow-card p-5 text-sm text-inksoft">No loans yet. Tap "Apply now" to start your first one.</p>
              : <LoanCard loan={loans[0]} onChanged={n => { if (n) setNotice(n); load() }} />}
          </div>
        </div>
      )}

      {tab === 'loans' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-extrabold">My loans</h2>
            {!applying && (
              <button onClick={() => setApplying(true)} className="flex items-center gap-1.5 bg-field hover:bg-field-deep text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
                <PlusIcon className="w-4 h-4" /> Apply
              </button>
            )}
          </div>

          {applying && <ApplyLoanPanel farmerId={farmerId} onDone={handleApplied} onCancel={() => setApplying(false)} />}

          <div className="flex flex-col gap-4">
            {loans.length === 0
              ? <p className="text-inksoft text-sm">No loans yet. Tap Apply to start your first one.</p>
              : loans.map(loan => (
                  <LoanCard key={loan.loanId} loan={loan} onChanged={n => { if (n) setNotice(n); load() }} />
                ))}
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-3xl shadow-card p-6 flex items-center gap-4">
            <Avatar name={data.fullName} size="w-16 h-16 text-2xl" />
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold truncate">{data.fullName}</h2>
              <p className="text-sm text-inksoft">@{userName}</p>
            </div>
          </div>

          <ProfilePanel farmerId={farmerId} onDone={handleProfileDone} />

          <button onClick={onSignOut} className="flex items-center justify-center gap-2 border border-err/30 text-err font-semibold py-3.5 rounded-xl hover:bg-err-bg transition-colors">
            <LogoutIcon className="w-5 h-5" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}