export default function SubmitButton({ children, loading, full }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={
        'bg-field hover:bg-field-deep disabled:opacity-55 disabled:cursor-not-allowed text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl transition-colors ' +
        (full ? 'w-full' : 'self-start')
      }
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}