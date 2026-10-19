const money = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })

export const formatMoney = n => money.format(n ?? 0)

export const formatDate = iso =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null

export const STATUS = {
  PENDING: { label: 'Accepted, awaiting disbursement', tone: 'bg-[#F4EBCB] text-[#7A5F0F]' },
  APPROVED: { label: 'Approved', tone: 'bg-ok-bg text-field-deep' },
  REPAYING: { label: 'Repaying', tone: 'bg-ok-bg text-field-deep' },
  FULLY_REPAID: { label: 'Fully repaid', tone: 'bg-sage text-inksoft' },
  DEFAULTED: { label: 'Defaulted', tone: 'bg-err-bg text-err' },
  REJECTED: { label: 'Rejected', tone: 'bg-err-bg text-err' }
}

export const PAYABLE = ['APPROVED', 'REPAYING', 'DEFAULTED']

export const addDays = (iso, n) => {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return d
}