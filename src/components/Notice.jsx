export default function Notice({ notice, onClose }) {
  if (!notice) return null
  const tone = notice.type === 'error' ? 'bg-err-bg text-err' : 'bg-ok-bg text-field-deep'
  return (
    <div className={'flex items-start justify-between gap-4 rounded-xl px-4 py-3 text-sm font-medium mb-5 ' + tone}>
      <span>{notice.text}</span>
      {onClose && <button onClick={onClose} className="text-xs underline shrink-0">Dismiss</button>}
    </div>
  )
}