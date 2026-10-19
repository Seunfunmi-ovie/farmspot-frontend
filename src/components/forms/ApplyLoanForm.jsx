import { useState } from 'react'
import Panel from '../Panel.jsx'
import Field, { TextInput } from '../Field.jsx'
import SubmitButton from '../SubmitButton.jsx'
import { callApi } from '../../api.js'

export default function ApplyLoanForm({ onResult }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    farmerId: '', requestedAmount: '', paymentMethod: '', escrowEnabled: false
  })

  function update(key) {
    return e => setForm({ ...form, [key]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const body = {
      farmerId: Number(form.farmerId),
      requestedAmount: Number(form.requestedAmount),
      paymentMethod: form.paymentMethod,
      escrowEnabled: form.escrowEnabled
    }
    const result = await callApi('POST', '/api/loans/applyLoan', body)
    setLoading(false)
    onResult(result)
  }

  return (
    <Panel title="Apply for a loan" desc="Runs disqualification, credit scoring, and the amount ceiling check.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Farmer ID">
          <TextInput type="number" required value={form.farmerId} onChange={update('farmerId')} />
        </Field>
        <Field label="Requested amount">
          <TextInput type="number" step="0.01" required value={form.requestedAmount} onChange={update('requestedAmount')} />
        </Field>
        <Field label="Payment method" hint="Must match a value in your PaymentMethod enum exactly.">
          <TextInput placeholder="e.g. BANK_TRANSFER" required value={form.paymentMethod} onChange={update('paymentMethod')} />
        </Field>
        <label className="flex items-center gap-2.5 text-sm text-inksoft">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={form.escrowEnabled}
            onChange={e => setForm({ ...form, escrowEnabled: e.target.checked })}
          />
          Escrow enabled
        </label>
        <SubmitButton loading={loading}>Submit application</SubmitButton>
      </form>
    </Panel>
  )
}
