import { useState } from 'react'
import Panel from '../Panel.jsx'
import Field, { TextInput } from '../Field.jsx'
import SubmitButton from '../SubmitButton.jsx'
import { callApi } from '../../api.js'

export default function RegisterForm({ onResult, onRegistered }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '', userName: '', email: '', phoneNumber: '', password: '',
    farmLocation: '', farmSizeHectares: '', historicAverageYieldKg: ''
  })

  function update(key) {
    return e => setForm({ ...form, [key]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const body = {
      ...form,
      farmSizeHectares: Number(form.farmSizeHectares),
      historicAverageYieldKg: Number(form.historicAverageYieldKg)
    }
    const result = await callApi('POST', '/api/farmer/register', body)
    setLoading(false)
    onResult(result)
    if (result.ok) onRegistered(form.userName)
  }

  return (
    <Panel title="Register a farmer" desc="Creates a farmer record and a zero-balance account in one step.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Full name">
          <TextInput required value={form.fullName} onChange={update('fullName')} />
        </Field>
        <Field label="Username">
          <TextInput required value={form.userName} onChange={update('userName')} />
        </Field>
        <Field label="Email">
          <TextInput type="email" required value={form.email} onChange={update('email')} />
        </Field>
        <Field label="Phone number">
          <TextInput required value={form.phoneNumber} onChange={update('phoneNumber')} />
        </Field>
        <Field label="Password">
          <TextInput type="password" required value={form.password} onChange={update('password')} />
        </Field>
        <Field label="Farm location">
          <TextInput required value={form.farmLocation} onChange={update('farmLocation')} />
        </Field>
        <Field label="Farm size (hectares)">
          <TextInput type="number" step="0.01" required value={form.farmSizeHectares} onChange={update('farmSizeHectares')} />
        </Field>
        <Field label="Historic average yield (kg)">
          <TextInput type="number" step="0.01" required value={form.historicAverageYieldKg} onChange={update('historicAverageYieldKg')} />
        </Field>
        <SubmitButton loading={loading}>Register farmer</SubmitButton>
      </form>
    </Panel>
  )
}
