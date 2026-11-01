import { LogoMark } from './Motifs.jsx'
import { LogoutIcon } from './Icons.jsx'

export default function Header({ session, isAdmin, items, tab, onTab, onSignOut }) {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-line sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <h1 className="text-xl font-extrabold text-field-deep">FarmsPot</h1>
        </div>

        {session && (
          <nav className="hidden md:flex items-center gap-1 bg-sage rounded-full p-1">
            {items.map(item => (
              <button
                key={item.key}
                onClick={() => onTab(item.key)}
                className={
                  'px-5 py-2 rounded-full text-sm font-semibold transition-colors ' +
                  (tab === item.key ? 'bg-white text-field-deep shadow-sm' : 'text-inksoft hover:text-ink')
                }
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {session && (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="bg-field text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                Admin
              </span>
            )}
            <span className="text-sm text-inksoft hidden sm:inline">{session.userName}</span>
            <button
              onClick={onSignOut}
              aria-label="Sign out"
              className="flex items-center gap-2 text-sm font-semibold text-field-deep bg-sage hover:bg-field-soft rounded-full px-3 py-2 transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}