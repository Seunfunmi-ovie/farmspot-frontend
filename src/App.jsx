import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import { request, warmUp } from './api.js'

const KEY = 'farmspot-session'
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

  return (
    <div className="min-h-screen">
      <Header userName={session?.userName} onSignOut={signOut} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        {session ? <Dashboard farmerId={session.farmerId} /> : <AuthScreen onSignedIn={signIn} />}
      </main>
    </div>
  )
}