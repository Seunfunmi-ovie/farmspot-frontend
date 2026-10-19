import { useState } from 'react'
import { TextInput } from './Field.jsx'
import Notice from './Notice.jsx'
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

  async function disburse() {
    setLoading(true)
    setError(null)
    const res = await request('POST', `/api/loans/disbursedLoan/${loan.loanId}`)
    setLoading(false)
    if (!res.ok) return setError({ type: 'error', text: res.message })
    onChanged()
  }

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
    <div className="bg-white border border-line rounded px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-inksoft">Loan #{loan.loanId}{disbursed ? ` · disbursed ${disbursed}` : ''}</div>
          <div className="font-serif text-2xl mt-0.5">{formatMoney(loan.requestedAmount)}</div>
        </div>
        <span className={'text-xs font-semibold px-2.5 py-1 rounded ' + status.tone}>{status.label}</span>
      </div>

      {showProgress && (
        <div className="mt-4">
          <div className="h-1.5 bg-sage rounded overflow-hidden">
            <div className="h-full bg-field" style={{ width: pct + '%' }} />
          </div>
          <div className="text-xs text-inksoft mt-1.5">
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
        <div className="mt-4">
          <p className="text-sm text-inksoft mb-3">
            Your loan passed all checks. Receive it to add {formatMoney(loan.requestedAmount)} to your balance.
          </p>
          <button
            onClick={disburse}
            disabled={loading}
            className="bg-field hover:bg-field-deep disabled:opacity-55 text-bg font-semibold text-sm px-4 py-2.5 rounded"
          >
            {loading ? 'Sending…' : 'Receive funds'}
          </button>
        </div>
      )}

      {PAYABLE.includes(loan.status) && !paying && (
        <button onClick={() => setPaying(true)} className="mt-4 text-sm font-semibold text-field underline">
          Make a payment
        </button>
      )}

      {paying && (
        <form onSubmit={pay} className="mt-4 flex flex-col gap-2">
          <div className="text-xs text-inksoft">
            You owe {formatMoney(owed)}.{' '}
            <button type="button" onClick={() => setAmount(owed.toFixed(2))} className="underline">Pay in full</button>
 
          </div>
          <div className="flex items-center gap-3">
            <TextInput type="number" step="0.01" required placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <button disabled={loading} className="bg-field hover:bg-field-deep disabled:opacity-55 text-bg font-semibold text-sm px-4 py-2.5 rounded">
              {loading ? 'Sending…' : 'Pay'}
            </button>
            <button type="button" onClick={() => { setPaying(false); setError(null) }} className="text-sm text-inksoft underline">Cancel</button>
          </div>
        </form>
      )}

      {error && <div className="mt-4"><Notice notice={error} /></div>}
    </div>
  )
}