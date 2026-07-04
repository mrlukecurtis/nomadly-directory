import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#faf8f3] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[224px] shrink-0 bg-forest text-white flex flex-col px-[18px] py-6">
        <p className="font-display font-semibold text-[18px] mx-1.5 mb-7">Nomadian admin</p>

        <nav className="flex flex-col gap-0.5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-nm-sm text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/admin/listings"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-nm-sm text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Listings
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-nm-sm text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Leads
          </Link>
        </nav>

        <div className="mt-auto flex items-center gap-2.5 px-1.5 pt-3 border-t border-white/14">
          <div className="w-[34px] h-[34px] rounded-full bg-white/18 flex items-center justify-center text-[13px] font-semibold shrink-0">
            A
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold">Admin</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
