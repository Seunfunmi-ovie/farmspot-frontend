export default function Header({ userName, onSignOut }) {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 bg-field text-bg">
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L12 22" stroke="#C9A332" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M12 5 Q9 6 8 8 Q10 8 12 7Z" fill="#C9A332" />
          <path d="M12 5 Q15 6 16 8 Q14 8 12 7Z" fill="#C9A332" />
          <path d="M12 9 Q9 10 8 12 Q10 12 12 11Z" fill="#C9A332" />
          <path d="M12 9 Q15 10 16 12 Q14 12 12 11Z" fill="#C9A332" />
          <path d="M12 13 Q9 14 8 16 Q10 16 12 15Z" fill="#C9A332" />
          <path d="M12 13 Q15 14 16 16 Q14 16 12 15Z" fill="#C9A332" />
        </svg>
        <h1 className="text-xl font-semibold">FarmsPot</h1>
      </div>
      {userName && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#E7E2D0]">{userName}</span>
          <button onClick={onSignOut} className="border border-white/30 rounded px-3 py-1.5 hover:bg-white/10">
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
