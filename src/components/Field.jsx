export default function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-inksoft">{hint}</span>}
    </label>
  )
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className="font-sans text-[15px] font-normal px-4 py-3 border border-line rounded-xl bg-white text-ink placeholder:text-inksoft/70 focus:outline-none focus:ring-2 focus:ring-field/30 focus:border-field"
    />
  )
}