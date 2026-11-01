import { useState } from 'react'
import Field, { TextInput } from './Field.jsx'
import SubmitButton from './SubmitButton.jsx'
import Notice from './Notice.jsx'
import { FieldBanner } from './Motifs.jsx'
import { request } from '../api.js'

const REGISTER_FIELDS = [
  ['fullName', 'Full name', 'text'],
  ['userName', 'Username', 'text'],
  ['email', 'Email', 'email'],
  ['phoneNumber', 'Phone number', 'text'],
  ['password', 'Password', 'password'],
  ['farmLocation', 'Farm location', 'text'],
  ['farmSizeHectares', 'Farm size (hectares)', 'number'],
  ['historicAverageYieldKg', 'Historic average yield (kg)', 'number']
]

export default function AuthScreen({ onSignedIn }) {
  const [mode, setMode] = useState('signin')
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState({ userName: '', password: '' })
  const [reg, setReg] = useState(Object.fromEntries(REGISTER_FIELDS.map(([key]) => [key, ''])))

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setNotice(null)
    const res = await request('POST', '/api/farmer/login', login)
    setLoading(false)
    if (!res.ok) return setNotice({ type: 'error', text: res.message })
    if (res.data?.farmerId == null) {
      return setNotice({ type: 'error', text: 'Signed in, but the server did not return your farmer id. Add farmerId to the login response.' })
    }
    onSignedIn({
      farmerId: res.data.farmerId,
      userName: login.userName,
      role: res.data.role || 'FARMER',
      token: res.data.token
    })
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setNotice(null)
    const body = {
      ...reg,
      farmSizeHectares: Number(reg.farmSizeHectares),
      historicAverageYieldKg: Number(reg.historicAverageYieldKg)
    }
    const res = await request('POST', '/api/farmer/register', body)
    setLoading(false)
    if (!res.ok) return setNotice({ type: 'error', text: res.message })
    setLogin({ userName: reg.userName, password: '' })
    setMode('signin')
    setNotice({ type: 'success', text: 'Account created. Sign in to continue.' })
  }

  const tab = active =>
    'pb-2 text-sm border-b-2 ' + (active ? 'border-gold text-field-deep font-semibold' : 'border-transparent text-inksoft')

  return (
    <div className="max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-lg shadow-card mb-6">
        <FieldBanner className="block w-full h-52" />
        <div className="absolute inset-0 px-8 py-7">
          <h2 className="text-3xl text-bg">Welcome to FarmsPot</h2>
          <p className="text-wheat mt-1 text-sm tracking-wide">Farm credit, simply managed.</p>
        </div>
      </div>

      <div className="bg-white border border-line rounded-lg shadow-card px-8 py-7">
        <div className="flex gap-6 mb-6 border-b border-line">
          <button className={tab(mode === 'signin')} onClick={() => { setMode('signin'); setNotice(null) }}>Sign in</button>
          <button className={tab(mode === 'register')} onClick={() => { setMode('register'); setNotice(null) }}>Create account</button>
        </div>

        <Notice notice={notice} />

        {mode === 'signin' ? (
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <Field label="Username">
              <TextInput required value={login.userName} onChange={e => setLogin({ ...login, userName: e.target.value })} />
            </Field>
            <Field label="Password">
              <TextInput type="password" required value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
            </Field>
            <SubmitButton loading={loading}>Sign in</SubmitButton>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            {REGISTER_FIELDS.map(([key, label, type]) => (
              <Field key={key} label={label}>
                <TextInput
                  type={type}
                  step={type === 'number' ? '0.01' : undefined}
                  required
                  value={reg[key]}
                  onChange={e => setReg({ ...reg, [key]: e.target.value })}
                />
              </Field>
            ))}
            <SubmitButton loading={loading}>Create account</SubmitButton>
          </form>
        )}
      </div>
    </div>
  )
}