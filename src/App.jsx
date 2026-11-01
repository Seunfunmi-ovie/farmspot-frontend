import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import { HomeIcon, WalletIcon, UserIcon, GridIcon, UsersIcon } from './components/Icons.jsx'
import { request, warmUp, SESSION_KEY } from './api.js'

const KEY = SESSION_KEY
const PING_EVERY_MS = 10 * 60 * 1000

const FARMER_TABS = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'loans', label: 'Loans', icon: WalletIcon },
  { key: 'profile', label: 'Profile', icon: UserIcon }
]

const ADMIN_TABS = [
  { key: 'overview', label: 'Overview', icon: GridIcon },
  { key: 'loans', label: 'Loans', icon: WalletIcon },
  { key: 'farmers', label: 'Farmers', icon: UsersIcon }
]

const firstTab = s => (s?.role === 'ADMIN' ? 'overview' : 'home')

export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) } catch { return null }
  })
  const [tab, setTab] = useState(() => firstTab(session))

  // Wake the server as soon as the page opens, then keep it awake while the tab is open.
  useEffect(() => {
    warmUp()
    const timer = setInterval(warmUp, PING_EVERY_MS)
    return () => clearInterval(timer)
  }, [])

  function signIn(s) {
    sessionStorage.setItem(KEY, JSON.stringify(s))
    setSession(s)
    setTab(firstTab(s))
  }

  function signOut() {
    if (session) request('POST', '/api/farmer/logout', { userName: session.userName })
    sessionStorage.removeItem(KEY)
    setSession(null)
  }

  const isAdmin = session?.role === 'ADMIN'
  const items = isAdmin ? ADMIN_TABS : FARMER_TABS

  return (
    <div className="min-h-screen">
      <Header session={session} isAdmin={isAdmin} items={items} tab={tab} onTab={setTab} onSignOut={signOut} />
      <main className={(isAdmin ? 'max-w-5xl' : 'max-w-lg') + ' mx-auto px-5 pt-6 pb-32 md:pb-14'}>
        {!session && <AuthScreen onSignedIn={signIn} />}
        {session && isAdmin && <AdminDashboard tab={tab} onTab={setTab} />}
        {session && !isAdmin && (
          <Dashboard farmerId={session.farmerId} userName={session.userName} tab={tab} onTab={setTab} onSignOut={signOut} />
        )}
      </main>
      {session && <BottomNav items={items} tab={tab} onTab={setTab} />}
    </div>
  )
}