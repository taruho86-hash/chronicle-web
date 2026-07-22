'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Profile {
  full_name: string
  phone: string
}

interface OrderItem {
  product_id: string
  name: string
  size: string | null
  qty: number
  price: number
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: string
  payment_method: string
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      setEmail(data.user.email ?? '')

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', data.user.id)
        .single()
      setProfile(profileData)

      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, items, total, status, payment_method, created_at')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
      setOrders(ordersData ?? [])

      setLoading(false)
    })
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const statusLabel = (status: string) => {
    if (status === 'done') return 'Хүргэгдсэн'
    if (status === 'confirmed') return 'Баталгаажсан'
    return 'Хүлээгдэж буй'
  }

  const statusColor = (status: string) => {
    if (status === 'done') return 'text-green-400'
    if (status === 'confirmed') return 'text-blue-400'
    return 'text-yellow-400'
  }

  if (loading) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-neutral-500 text-[13px]">Түр хүлээнэ үү...</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-8 pb-6 max-w-sm md:max-w-2xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4 text-white text-[20px] font-bold">
        {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
      </div>

      <h1 className="text-white font-bold text-[20px] mb-1">
        {profile?.full_name || 'Хэрэглэгч'}
      </h1>
      <p className="text-neutral-400 text-[12px] mb-6">{email}</p>

      <div className="bg-neutral-900 rounded-2xl p-4 mb-4">
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <span className="text-neutral-400 text-[12px]">Утас</span>
          <span className="text-white text-[12px]">{profile?.phone || '-'}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-neutral-400 text-[12px]">Имэйл</span>
          <span className="text-white text-[12px]">{email}</span>
        </div>
      </div>

      <h2 className="text-neutral-400 text-[11px] font-semibold tracking-wide mb-2 mt-6">
        ЗАХИАЛГЫН ТҮҮХ
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-neutral-500 text-[12px]">Захиалга байхгүй байна.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-neutral-900 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-500 text-[10.5px]">
                  {new Date(order.created_at).toLocaleDateString('mn-MN')}
                </span>
                <span className={`text-[10.5px] font-semibold ${statusColor(order.status)}`}>
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="text-white text-[12px] mb-1">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    {item.name}
                    {item.size ? ` (${item.size})` : ''} × {item.qty}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-800">
                <span className="text-neutral-400 text-[11px]">
                  {order.payment_method === 'qpay' ? 'QPay' : 'Данс'}
                </span>
                <span className="text-white text-[13px] font-semibold">
                  {order.total.toLocaleString('mn-MN')}₮
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="text-red-400 text-[12px] mt-6 block mx-auto underline"
      >
        Гарах
      </button>
    </div>
  )
}