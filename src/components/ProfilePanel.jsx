import { useState } from 'react'
import Field, { TextInput } from './Field.jsx'
import SubmitButton from './SubmitButton.jsx'
import Notice from './Notice.jsx'
import { request } from '../api.js'

const FIELDS = [
  ['fullName', 'Full name', 'text'],
  ['email', 'Email', 'email'],
  ['phoneNumber', 'Phone number', 'text'],
  ['farmLocation', 'Farm location', 'text'],
  ['farmSizeHectares', 'Farm size (hectares)', 'number'],
  ['historicAverageYieldKg', 'Historic average yield (kg)', 'number']
]

const NUMERIC = ['farmSizeHectares', 'historicAverageYieldKg']

export default function ProfilePanel({ farmerId, onDone, onCancel }) {
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map(([key]) => [key, ''])))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)

    // Only send what the farmer actually filled in; empty fields keep their current value.
    const body = {}
    for (const [key] of FIELDS) {
      const value = form[key].trim()
      if (value === '') continue
      body[key] = NUMERIC.includes(key) ? Number(value) : value
    }
    if (Object.keys(body).length === 0) {
      return setError({ type: 'error', text: 'Fill in at least one field to update.' })
    }

    setLoading(true)
    const res = await request('PUT', `/api/farmer/${farmerId}/profile`, body)
    setLoading(false)
    if (!res.ok) return setError({ type: 'error', text: res.message })
    onDone({ type: 'success', text: res.data?.message || 'Profile updated.' })
  }

  return (
    <form onSubmit={submit} className="bg-white border border-line rounded-lg shadow-card px-8 py-7 mb-6 flex flex-col gap-4">
      <h3 className="text-lg">Edit your profile</h3>
      <p className="text-sm text-inksoft -mt-2">Only the fields you fill in will be changed.</p>
      <Notice notice={error} />
      {FIELDS.map(([key, label, type]) => (
        <Field key={key} label={label}>
          <TextInput
            type={type}
            step={type === 'number' ? '0.01' : undefined}
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
          />
        </Field>
      ))}
      <div className="flex items-center gap-4">
        <SubmitButton loading={loading}>Save changes</SubmitButton>
        <button type="button" onClick={onCancel} className="text-sm text-inksoft underline mt-1.5">Cancel</button>
      </div>
    </form>
  )
}