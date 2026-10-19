export default function Notice({ notice, onClose }) {
  if (!notice) return null
  const tone = notice.type === 'error'
    ? 'bg-err-bg text-err border-err'
    : 'bg-ok-bg text-field-deep border-field'
  return (
    <div className={'flex items-start justify-between gap-4 border-l-4 rounded px-4 py-3 text-sm mb-5 ' + tone}>
      <span>{notice.text}</span>
      {onClose && <button onClick={onClose} className="text-xs underline shrink-0">Dismiss</button>}
    </div>
  )
}
