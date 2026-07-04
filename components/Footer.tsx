import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-forest text-white">
      <div className="max-w-[1280px] mx-auto px-8 pt-12 pb-10">
        <div className="flex justify-between flex-wrap gap-10">
          <div className="max-w-[280px]">
            <p className="font-display font-semibold text-xl mb-3">Nomadian</p>
            <p className="text-sm leading-relaxed text-white/68">
              The best place in Australia to get inspired, get informed, and connect with vetted pros for campervan and adventure vehicle builds.
            </p>
          </div>

          <div className="flex gap-14">
            <div className="flex flex-col gap-2.5 text-sm text-white/68">
              <p className="text-white font-semibold mb-0.5">Browse builders</p>
              <Link href="/van-conversions/" className="hover:text-white transition-colors">Van converters</Link>
              <Link href="/van-conversions/" className="hover:text-white transition-colors">Campervan builders</Link>
              <Link href="/van-conversions/" className="hover:text-white transition-colors">4x4 outfitters</Link>
            </div>

            <div className="flex flex-col gap-2.5 text-sm text-white/68">
              <p className="text-white font-semibold mb-0.5">For pros</p>
              <Link href="/list-your-business" className="hover:text-white transition-colors">List your business</Link>
              <Link href="/list-your-business" className="hover:text-white transition-colors">Grow your business</Link>
            </div>

            <div className="flex flex-col gap-2.5 text-sm text-white/68">
              <p className="text-white font-semibold mb-0.5">Company</p>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 mt-9 pt-5 text-[13px] text-white/55">
          &copy; {year} Nomadian. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
