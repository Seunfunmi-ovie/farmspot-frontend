export default function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-inksoft">
      {label}
      {children}
      {hint && <span className="text-xs text-soil -mt-1">{hint}</span>}
    </label>
  )
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className="font-sans text-[14.5px] px-3 py-2.5 border border-line rounded-md bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
    />
  )
}