export default function Panel({ title, desc, children }) {
  return (
    <section className="bg-white border border-line rounded max-w-xl px-8 py-7">
      <h2 className="text-xl mb-1">{title}</h2>
      <p className="text-[13.5px] text-inksoft mb-5">{desc}</p>
      {children}
    </section>
  )
}
