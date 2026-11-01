import { useState } from 'react'
import { TextInput } from './Field.jsx'
import Notice from './Notice.jsx'
import { WalletIcon } from './Icons.jsx'
import { request } from '../api.js'
import { formatMoney, formatDate, addDays, STATUS, PAYABLE } from '../format.js'

export default function LoanCard({ loan, onChanged }) {
  const [paying, setPaying] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const status = STATUS[loan.status] || { label: loan.status, tone: 'bg-sage text-inksoft' }
  const owed = Math.max(0, loan.requestedAmount - loan.amountRepaid)
  const pct = loan.requestedAmount > 0 ? Math.min(100, (loan.amountRepaid / loan.requestedAmount) * 100) : 0
  const disbursed = formatDate(loan.disbursementDate)
  const running = loan.status === 'APPROVED' || loan.status === 'REPAYING'
  const due = running && loan.disbursementDate ? addDays(loan.disbursementDate, 30) : null
  const cutoff = due ? addDays(loan.disbursementDate, 33) : null
  const overdue = due && new Date() > due
  const showProgress = loan.status !== 'REJECTED' && loan.status !== 'PENDING'

  async function pay(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await request('POST', `/api/loans/recordEscrowPayment/${loan.loanId}/${Number(amount)}`)
    setLoading(false)
    if (!res.ok) return setError({ type: 'error', text: res.message })
    setPaying(false)
    setAmount('')
    onChanged({ type: 'success', text: 'Payment recorded. Your balance and loan have been updated.' })
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 shrink-0 rounded-xl bg-field-soft text-field flex items-center justify-center">
            <WalletIcon className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="text-xs text-inksoft truncate">Loan #{loan.loanId}{disbursed ? ` · ${disbursed}` : ''}</div>
            <div className="text-xl font-extrabold">{formatMoney(loan.requestedAmount)}</div>
          </div>
        </div>
        <span className={'text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ' + status.tone}>{status.label}</span>
      </div>

      {showProgress && (
        <div className="mt-4">
          <div className="h-2 bg-sage rounded-full overflow-hidden">
            <div className="h-full bg-field rounded-full" style={{ width: pct + '%' }} />
          </div>
          <div className="text-xs text-inksoft mt-2">
            {formatMoney(loan.amountRepaid)} repaid of {formatMoney(loan.requestedAmount)}
          </div>
        </div>
      )}

      {due && (
        <p className={'text-sm mt-3 ' + (overdue ? 'text-err font-semibold' : 'text-inksoft')}>
          {overdue
            ? `Payment overdue. Pay before ${formatDate(cutoff)} to avoid default.`
            : `Due by ${formatDate(due)}`}
        </p>
      )}

      {loan.status === 'DEFAULTED' && (
        <p className="text-sm mt-3 text-err font-semibold">This loan is in default. Repay it in full to clear it.</p>
      )}

      {loan.status === 'PENDING' && (
        <p className="text-sm mt-4 text-inksoft">
          Your loan passed all checks. FarmsPot will release {formatMoney(loan.requestedAmount)} to your balance shortly.
        </p>
      )}

      {PAYABLE.includes(loan.status) && !paying && (
        <button onClick={() => setPaying(true)} className="mt-4 w-full bg-field-soft hover:bg-wheat text-field-deep font-bold text-sm py-3 rounded-xl transition-colors">
          Make a payment
        </button>
      )}

      {paying && (
        <form onSubmit={pay} className="mt-4 flex flex-col gap-2">
          <div className="text-xs text-inksoft">
            You owe {formatMoney(owed)}.{' '}
            <button type="button" onClick={() => setAmount(owed.toFixed(2))} className="font-semibold text-field underline">Pay in full</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="grow [&>input]:w-full">
              <TextInput type="number" step="0.01" required placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <button disabled={loading} className="bg-field hover:bg-field-deep disabled:opacity-55 text-white font-semibold text-sm px-5 py-3 rounded-xl">
              {loading ? 'Sending…' : 'Pay'}
            </button>
          </div>
          <button type="button" onClick={() => { setPaying(false); setError(null) }} className="self-start text-sm text-inksoft underline">Cancel</button>
        </form>
      )}

      {error && <div className="mt-4"><Notice notice={error} /></div>}
    </div>
  )
}