import { useState } from 'react'
import Panel from '../Panel.jsx'
import Field, { TextInput } from '../Field.jsx'
import SubmitButton from '../SubmitButton.jsx'
import { callApi } from '../../api.js'

export default function LogoutForm({ onResult, onSignedOut }) {
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const result = await callApi('POST', '/api/farmer/logout', { userName })
    setLoading(false)
    onResult(result)
    if (result.ok) onSignedOut()
  }

  return (
    <Panel title="Log out" desc="Ends the farmer's session.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Username" hint="Assumed field — check LogoutFarmersRequest.java and adjust if needed.">
          <TextInput required value={userName} onChange={e => setUserName(e.target.value)} />
        </Field>
        <SubmitButton loading={loading}>Log out</SubmitButton>
      </form>
    </Panel>
  )
}
