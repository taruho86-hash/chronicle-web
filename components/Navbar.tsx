'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-black flex items-center justify-between px-4 py-4">
      <Link href="/" className="text-white font-bold text-[15px] tracking-wide">
        CHRONICLE
      </Link>
      <Link href="/cart" className="relative">
        <ShoppingBag size={20} className="text-white" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-white text-black text-[9px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    </header>
  )
}