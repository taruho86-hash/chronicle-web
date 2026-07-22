'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3x3, Info, User } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function TabBar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const tabs = [
    { href: '/', label: 'Нүүр', icon: Home },
    { href: '/products', label: 'Бараа', icon: Grid3x3 },
    { href: '/info', label: 'Мэдээлэл', icon: Info },
    {
      href: user ? '/profile' : '/login',
      label: user ? 'Профайл' : 'Нэвтрэх',
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 flex justify-around items-center py-2 px-2 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <div
              className={`flex items-center justify-center rounded-full transition-colors ${
                isActive ? 'bg-white text-black px-4 py-1.5' : 'text-neutral-500'
              }`}
            >
              <Icon size={18} />
            </div>
            {!isActive && (
              <span className="text-[9.5px] text-neutral-500">{tab.label}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}