import { useState } from 'react'
import Field, { TextInput } from './Field.jsx'
import SubmitButton from './SubmitButton.jsx'
import Notice from './Notice.jsx'
import { FieldBanner, LogoMark } from './Motifs.jsx'
import { ShieldIcon } from './Icons.jsx'
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

const MODES = [
  ['signin', 'Sign in'],
  ['register', 'Sign up'],
  ['admin', 'Admin']
]

export default function AuthScreen({ onSignedIn }) {
  const [mode, setMode] = useState('signin')
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState({ userName: '', password: '' })
  const [reg, setReg] = useState(Object.fromEntries(REGISTER_FIELDS.map(([key]) => [key, ''])))

  function switchMode(next) {
    setMode(next)
    setNotice(null)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setNotice(null)
    const res = await request('POST', '/api/farmer/login', login)
    setLoading(false)
    if (!res.ok) return setNotice({ type: 'error', text: res.message })
    if (res.data?.farmerId == null) {
      return setNotice({ type: 'error', text: 'Signed in, but the server did not return your account id.' })
    }
    const role = res.data.role || 'FARMER'
    if (mode === 'admin' && role !== 'ADMIN') {
      return setNotice({ type: 'error', text: "This account doesn't have admin access." })
    }
    onSignedIn({ farmerId: res.data.farmerId, userName: login.userName, role, token: res.data.token })
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

  const isAdminMode = mode === 'admin'

  return (
    <div className="max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-3xl shadow-card">
        <FieldBanner className="block w-full h-56" />
        <div className="absolute inset-0 px-7 py-6 flex flex-col gap-4">
          <LogoMark className="w-11 h-11 bg-white/20 backdrop-blur" />
          <div>
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              {isAdminMode ? 'Admin access' : 'Welcome to FarmsPot'}
            </h2>
            <p className="text-wheat text-sm mt-1">
              {isAdminMode ? 'For FarmsPot staff only.' : 'Farm credit, simply managed.'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative -mt-6 mx-2 bg-white rounded-3xl shadow-card px-6 pt-6 pb-7">
        <div className="grid grid-cols-3 gap-1 bg-sage rounded-full p-1 mb-6">
          {MODES.map(([key, label]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={
                'flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[13px] font-semibold transition-colors ' +
                (mode === key ? 'bg-white text-field-deep shadow-sm' : 'text-inksoft')
              }
            >
              {key === 'admin' && <ShieldIcon className="w-4 h-4" />}
              {label}
            </button>
          ))}
        </div>

        <Notice notice={notice} />

        {mode === 'register' ? (
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
            <SubmitButton loading={loading} full>Create my account</SubmitButton>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <Field label="Username">
              <TextInput required value={login.userName} onChange={e => setLogin({ ...login, userName: e.target.value })} />
            </Field>
            <Field label="Password">
              <TextInput type="password" required value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
            </Field>
            <SubmitButton loading={loading} full>{isAdminMode ? 'Sign in as admin' : 'Sign in'}</SubmitButton>
          </form>
        )}
      </div>
    </div>
  )
}