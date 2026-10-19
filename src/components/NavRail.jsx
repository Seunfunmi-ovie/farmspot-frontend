const ITEMS = [
  { id: 'register', label: 'Register a farmer' },
  { id: 'login', label: 'Log in' },
  { id: 'apply', label: 'Apply for a loan' },
  { id: 'disburse', label: 'Disburse a loan' },
  { id: 'repay', label: 'Record a payment' },
  { id: 'logout', label: 'Log out' }
]

export default function NavRail({ active, onSelect }) {
  return (
    <nav className="flex flex-col gap-1 px-4 py-7 border-r border-line md:border-r md:border-b-0 border-b md:flex-col flex-row md:overflow-visible overflow-x-auto">
      {ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={
            'text-left px-3.5 py-2.5 rounded text-sm whitespace-nowrap border-l-[3px] ' +
            (active === item.id
              ? 'bg-sage text-field-deep font-semibold border-gold'
              : 'text-inksoft border-transparent hover:bg-sage hover:text-ink')
          }
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
