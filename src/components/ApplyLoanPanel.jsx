import { useState } from 'react'
import Field, { TextInput } from './Field.jsx'
import SubmitButton from './SubmitButton.jsx'
import Notice from './Notice.jsx'
import { request } from '../api.js'

// Must match the values in your PaymentMethod enum.
const PAYMENT_METHODS = ['BANK_TRANSFER']

export default function ApplyLoanPanel({ farmerId, onDone, onCancel }) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState(PAYMENT_METHODS[0])
  const [escrow, setEscrow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await request('POST', '/api/loans/applyLoan', {
      farmerId,
      requestedAmount: Number(amount),
      paymentMethod: method,
      escrowEnabled: escrow
    })
    setLoading(false)
    if (!res.ok) return setError({ type: 'error', text: res.message })
    const rejected = res.data?.loanStatus === 'REJECTED'
    onDone({ type: rejected ? 'error' : 'success', text: res.data?.message || 'Application submitted.' })
  }

  return (
    <form onSubmit={submit} className="bg-white border border-line rounded px-8 py-7 mb-6 flex flex-col gap-4">
      <h3 className="text-lg">Apply for a loan</h3>
      <Notice notice={error} />
      <Field label="Amount you need">
        <TextInput type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} />
      </Field>
      <Field label="Payment method">
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          className="text-[14.5px] px-3 py-2.5 border border-line rounded bg-[#FDFCF8] text-ink focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace('_', ' ').toLowerCase()}</option>)}
        </select>
      </Field>
      <label className="flex items-center gap-2.5 text-sm text-inksoft">
        <input type="checkbox" className="w-4 h-4" checked={escrow} onChange={e => setEscrow(e.target.checked)} />
        Hold repayments in escrow
      </label>
      <div className="flex items-center gap-4">
        <SubmitButton loading={loading}>Submit application</SubmitButton>
        <button type="button" onClick={onCancel} className="text-sm text-inksoft underline mt-1.5">Cancel</button>
      </div>
    </form>
  )
}
