import { formatMoney } from '../../format.js'

function Card({ label, value, sub }) {
  return (
    <div className="bg-white border border-line rounded-lg shadow-card px-5 py-4">
      <div className="text-xs text-inksoft">{label}</div>
      <div className="font-serif text-2xl mt-1">{value}</div>
      {sub && <div className="text-xs text-inksoft mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminStats({ stats }) {
  if (!stats) return <p className="text-inksoft text-sm mb-8">Loading numbers…</p>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card label="Farmers" value={stats.totalFarmers} />
      <Card label="Awaiting release" value={stats.pendingLoans} sub="accepted, funds not sent" />
      <Card label="Active loans" value={stats.activeLoans} sub={`${stats.fullyRepaidLoans} fully repaid`} />
      <Card label="Defaulted" value={stats.defaultedLoans} sub={`${stats.defaultRatePercent}% of disbursed loans`} />
      <Card label="Disbursed" value={formatMoney(stats.totalDisbursed)} />
      <Card label="Repaid" value={formatMoney(stats.totalRepaid)} />
      <Card label="Outstanding" value={formatMoney(stats.totalOutstanding)} />
      <Card label="Held in accounts" value={formatMoney(stats.totalAccountBalances)} />
    </div>
  )
}