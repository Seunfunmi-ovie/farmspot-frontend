import { formatMoney } from '../../format.js'
import { WheatField } from '../Motifs.jsx'
import { UsersIcon, WalletIcon, ShieldIcon, GridIcon } from '../Icons.jsx'

function Tile({ label, value, sub, icon: Icon, tone }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-4">
      <span className={'w-10 h-10 rounded-xl flex items-center justify-center ' + tone}>
        <Icon className="w-5 h-5" />
      </span>
      <div className="text-2xl font-extrabold mt-3">{value}</div>
      <div className="text-xs font-semibold text-ink mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-inksoft mt-0.5">{sub}</div>}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-t border-line first:border-t-0">
      <span className="text-sm text-inksoft">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  )
}

export default function AdminStats({ stats, onTab }) {
  if (!stats) return <p className="text-inksoft text-sm">Loading numbers…</p>

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-field to-field-deep text-white p-6 shadow-card">
        <WheatField className="absolute right-2 bottom-0 h-full text-white opacity-[0.13]" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-widest text-wheat">Total disbursed</div>
          <div className="text-3xl sm:text-4xl font-extrabold mt-2">{formatMoney(stats.totalDisbursed)}</div>
          <div className="text-sm text-wheat mt-1">{formatMoney(stats.totalRepaid)} repaid so far</div>
        </div>
      </div>

      {stats.pendingLoans > 0 && (
        <button
          onClick={() => onTab('loans')}
          className="flex items-center justify-between gap-3 bg-[#FFF1D6] text-[#8A5A00] rounded-2xl px-5 py-4 text-left"
        >
          <span className="text-sm font-semibold">
            {stats.pendingLoans} {stats.pendingLoans === 1 ? 'loan is' : 'loans are'} waiting for you to release the funds
          </span>
          <span className="text-sm font-bold underline shrink-0">Review</span>
        </button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Tile label="Farmers" value={stats.totalFarmers} icon={UsersIcon} tone="bg-field-soft text-field" />
        <Tile label="Awaiting release" value={stats.pendingLoans} icon={WalletIcon} tone="bg-[#FFF1D6] text-[#B87400]" />
        <Tile label="Active loans" value={stats.activeLoans} sub={`${stats.fullyRepaidLoans} fully repaid`} icon={GridIcon} tone="bg-field-soft text-field" />
        <Tile label="Defaulted" value={stats.defaultedLoans} sub={`${stats.defaultRatePercent}% of disbursed`} icon={ShieldIcon} tone="bg-err-bg text-err" />
      </div>

      <div className="bg-white rounded-2xl shadow-card px-5 py-1">
        <Row label="Repaid" value={formatMoney(stats.totalRepaid)} />
        <Row label="Outstanding" value={formatMoney(stats.totalOutstanding)} />
        <Row label="Held in farmer accounts" value={formatMoney(stats.totalAccountBalances)} />
      </div>
    </div>
  )
}