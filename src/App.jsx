import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import { request, warmUp, SESSION_KEY } from './api.js'

const KEY = SESSION_KEY
const PING_EVERY_MS = 10 * 60 * 1000

export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) } catch { return null }
  })

  // Wake the server as soon as the page opens, then keep it awake while the tab is open.
  useEffect(() => {
    warmUp()
    const timer = setInterval(warmUp, PING_EVERY_MS)
    return () => clearInterval(timer)
  }, [])

  function signIn(s) {
    sessionStorage.setItem(KEY, JSON.stringify(s))
    setSession(s)
  }

  function signOut() {
    if (session) request('POST', '/api/farmer/logout', { userName: session.userName })
    sessionStorage.removeItem(KEY)
    setSession(null)
  }

  const isAdmin = session?.role === 'ADMIN'

  return (
    <div className="min-h-screen">
      <Header userName={session?.userName} isAdmin={isAdmin} onSignOut={signOut} />
      <main className={(isAdmin ? 'max-w-6xl' : 'max-w-3xl') + ' mx-auto px-6 py-10'}>
        {!session && <AuthScreen onSignedIn={signIn} />}
        {session && isAdmin && <AdminDashboard />}
        {session && !isAdmin && <Dashboard farmerId={session.farmerId} />}
      </main>
    </div>
  )
}