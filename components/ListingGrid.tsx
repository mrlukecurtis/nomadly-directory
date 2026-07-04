import type { ListingCard } from '@/lib/types'
import ListingCardComponent from './ListingCard'

export default function ListingGrid({ listings }: { listings: ListingCard[] }) {
  if (listings.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body-muted text-base">No listings found for these filters.</p>
        <p className="text-slate text-sm mt-2">Try adjusting your state or feature filters.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
      {listings.map(l => (
        <ListingCardComponent key={l.id} listing={l} />
      ))}
    </div>
  )
}
