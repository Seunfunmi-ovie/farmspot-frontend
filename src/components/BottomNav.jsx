// Phone-style tab bar. On larger screens the same tabs appear in the header instead.
export default function BottomNav({ items, tab, onTab }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-line rounded-t-3xl shadow-[0_-6px_24px_rgba(20,35,26,0.07)] px-4 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {items.map(item => {
          const Icon = item.icon
          const active = tab === item.key
          return (
            <button
              key={item.key}
              onClick={() => onTab(item.key)}
              className={'flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl text-[11px] font-semibold transition-colors ' + (active ? 'text-field' : 'text-inksoft')}
            >
              <span className={'flex items-center justify-center w-11 h-7 rounded-full transition-colors ' + (active ? 'bg-field-soft' : '')}>
                <Icon className="w-[22px] h-[22px]" />
              </span>
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}