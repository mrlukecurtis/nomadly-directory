import Link from 'next/link'

interface BreadcrumbItem {
  name: string
  url: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-[9px] text-sm text-slate mb-6">
      {items.map((item, i) => (
        <span key={item.url} className="flex items-center gap-[9px]">
          {i > 0 && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c7bfae" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          {i < items.length - 1 ? (
            <Link href={item.url} className="hover:text-ink transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-ink font-semibold">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
