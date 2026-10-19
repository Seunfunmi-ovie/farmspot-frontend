export default function ResponsePanel({ result }) {
  return (
    <div className="max-w-xl mt-7">
      <h3 className="text-sm text-inksoft mb-2.5">Response</h3>
      {!result ? (
        <p className="text-sm italic text-inksoft">Nothing sent yet.</p>
      ) : (
        <div className="border border-line rounded overflow-hidden">
          <div
            className={
              'px-4 py-2.5 text-sm font-semibold border-l-4 ' +
              (result.ok
                ? 'border-field bg-ok-bg text-field-deep'
                : 'border-err bg-err-bg text-err')
            }
          >
            {result.method} {result.path} &nbsp;→&nbsp; {result.status ?? 'network error'}
          </div>
          <pre className="m-0 p-4 text-xs font-mono bg-[#FDFCF8] overflow-x-auto whitespace-pre-wrap break-words">
            {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
