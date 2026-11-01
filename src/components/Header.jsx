import { Logo } from './Motifs.jsx'

export default function Header({ userName, isAdmin, onSignOut }) {
  return (
    <header className="bg-bg border-b border-line">
      <div className={(isAdmin ? 'max-w-6xl' : 'max-w-3xl') + ' mx-auto flex items-center justify-between px-6 py-4'}>
        <div className="flex items-center gap-2.5 text-gold">
          <Logo />
          <h1 className="text-2xl font-semibold text-field-deep">FarmsPot</h1>
        </div>
        {userName && (
          <div className="flex items-center gap-4 text-sm">
            {isAdmin && (
              <span className="bg-field text-wheat text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full">
                Admin
              </span>
            )}
            <span className="text-inksoft hidden sm:inline">{userName}</span>
            <button
              onClick={onSignOut}
              className="border border-field/30 text-field-deep rounded-md px-3.5 py-1.5 hover:bg-field hover:text-bg transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}