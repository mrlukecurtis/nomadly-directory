export default function TagBadge({ label }: { label: string }) {
  return (
    <span className="inline-block bg-cream text-ink text-xs font-medium px-[10px] py-1 rounded-full border border-hairline">
      {label}
    </span>
  )
}
