export default function SubmitButton({ children, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1.5 self-start bg-field hover:bg-field-deep disabled:opacity-55 disabled:cursor-not-allowed text-bg font-semibold text-[14.5px] px-5 py-3 rounded"
    >
      {loading ? 'Sending…' : children}
    </button>
  )
}
