import { useState } from 'react'
import Panel from '../Panel.jsx'
import Field, { TextInput } from '../Field.jsx'
import SubmitButton from '../SubmitButton.jsx'
import { callApi } from '../../api.js'

export default function DisburseForm({ onResult }) {
  const [loading, setLoading] = useState(false)
  const [loanId, setLoanId] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const result = await callApi('POST', '/api/loans/disbursedLoan/' + loanId, null)
    setLoading(false)
    onResult(result)
  }

  return (
    <Panel title="Disburse a loan" desc="Moves a pending loan to approved and credits the farmer's account.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Loan ID">
          <TextInput type="number" required value={loanId} onChange={e => setLoanId(e.target.value)} />
        </Field>
        <SubmitButton loading={loading}>Disburse</SubmitButton>
      </form>
    </Panel>
  )
}
