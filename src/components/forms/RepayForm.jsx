import { useState } from 'react'
import Panel from '../Panel.jsx'
import Field, { TextInput } from '../Field.jsx'
import SubmitButton from '../SubmitButton.jsx'
import { callApi } from '../../api.js'

export default function RepayForm({ onResult }) {
  const [loading, setLoading] = useState(false)
  const [loanId, setLoanId] = useState('')
  const [amount, setAmount] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const result = await callApi('POST', '/api/loans/recordEscrowPayment/' + loanId + '/' + amount, null)
    setLoading(false)
    onResult(result)
  }

  return (
    <Panel title="Record a payment" desc="Applies an escrow payment toward an approved, repaying, or defaulted loan.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Loan ID">
          <TextInput type="number" required value={loanId} onChange={e => setLoanId(e.target.value)} />
        </Field>
        <Field label="Amount">
          <TextInput type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} />
        </Field>
        <SubmitButton loading={loading}>Record payment</SubmitButton>
      </form>
    </Panel>
  )
}
