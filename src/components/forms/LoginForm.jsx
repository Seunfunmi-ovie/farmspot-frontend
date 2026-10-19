import { useState } from 'react'
import Panel from '../Panel.jsx'
import Field, { TextInput } from '../Field.jsx'
import SubmitButton from '../SubmitButton.jsx'
import { callApi } from '../../api.js'

export default function LoginForm({ onResult, onSignedIn }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ userName: '', password: '' })

  function update(key) {
    return e => setForm({ ...form, [key]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const result = await callApi('POST', '/api/farmer/login', form)
    setLoading(false)
    onResult(result)
    if (result.ok) onSignedIn(form.userName)
  }

  return (
    <Panel title="Log in" desc="Confirms a farmer's username and password.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Username">
          <TextInput required value={form.userName} onChange={update('userName')} />
        </Field>
        <Field label="Password">
          <TextInput type="password" required value={form.password} onChange={update('password')} />
        </Field>
        <SubmitButton loading={loading}>Log in</SubmitButton>
      </form>
    </Panel>
  )
}
