function Icon({ children, className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const HomeIcon = p => <Icon {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h13V10" /><path d="M10 19.5v-5h4v5" /></Icon>
export const WalletIcon = p => <Icon {...p}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" /><rect x="3.5" y="8" width="17" height="11.5" rx="2.5" /><circle cx="16.5" cy="13.75" r="1.1" fill="currentColor" /></Icon>
export const UserIcon = p => <Icon {...p}><circle cx="12" cy="8.5" r="3.6" /><path d="M5 20c.8-3.6 3.7-5.5 7-5.5s6.2 1.9 7 5.5" /></Icon>
export const UsersIcon = p => <Icon {...p}><circle cx="9" cy="9" r="3.2" /><path d="M3 19c.6-3.2 3-4.8 6-4.8s5.4 1.6 6 4.8" /><path d="M16 5.9a3.2 3.2 0 0 1 0 6.2" /><path d="M18 14.4c1.7.6 2.8 2 3 4.6" /></Icon>
export const GridIcon = p => <Icon {...p}><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></Icon>
export const LogoutIcon = p => <Icon {...p}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="m10 16 4-4-4-4" /><path d="M14 12H4" /></Icon>
export const PlusIcon = p => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
export const ShieldIcon = p => <Icon {...p}><path d="M12 3 5 6v5.5c0 4.3 2.8 7.7 7 9.5 4.2-1.8 7-5.2 7-9.5V6l-7-3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></Icon>