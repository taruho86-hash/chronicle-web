'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'

export default function CartPage() {
  const router = useRouter()
  const { items, changeQty, removeItem, total, clearCart } = useCart()
  const { user } = useAuth()

  const [showCheckout, setShowCheckout] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCheckoutClick = () => {
    if (!user) {
      router.push('/login')
      return
    }
    setShowCheckout(true)
  }

  const handleSubmit = async () => {
    setError('')
    if (!customerName || !phone || !address) {
      setError('Бүх талбарыг бөглөнө үү.')
      return
    }
    setSubmitting(true)

    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('orders').insert({
      user_id: userData.user?.id,
      items: items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        size: i.size,
        qty: i.qty,
        price: i.price,
      })),
      customer_name: customerName,
      phone,
      address,
      payment_method: 'bank',
      total,
      status: 'pending',
    })

    if (insertError) {
      setError('Захиалга хадгалахад алдаа гарлаа: ' + insertError.message)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    clearCart()
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="px-4 pt-16 text-center max-w-sm md:max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 text-white text-[24px]">
          ✓
        </div>
        <h1 className="text-white font-bold text-[20px] mb-2">Баярлалаа!</h1>
        <p className="text-neutral-400 text-[13px] leading-relaxed mb-6">
          Таны захиалгыг бүртгэлдээ хадгаллаа. Дансаар шилжүүлсэн баримтын
          зургаа @chronicle.mongolia Instagram-руу илгээж захиалгаа
          баталгаажуулна уу.
        </p>
        <button
          onClick={() => router.push('/profile')}
          className="bg-white text-black text-[12.5px] font-bold rounded-full px-6 py-3"
        >
          Профайл руу очих
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-neutral-500 text-[13px] mb-4">Сагс хоосон байна.</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-white text-black text-[12px] font-bold rounded-full px-5 py-2.5"
        >
          Бараа үзэх
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-6 max-w-sm md:max-w-2xl mx-auto">
      <h1 className="text-white font-bold text-[22px] mb-5">САГС</h1>

      {!showCheckout ? (
        <>
          <div className="flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <div
                key={item.productId + item.size}
                className="bg-neutral-900 rounded-xl p-3 flex gap-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-[13px] font-semibold truncate">
                    {item.name}
                  </div>
                  <div className="text-neutral-400 text-[11px] mb-2">
                    {item.size ? `Хэмжээ: ${item.size} · ` : ''}
                    {item.price.toLocaleString('mn-MN')}₮
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => changeQty(item.productId, item.size, -1)}
                      className="w-6 h-6 border border-neutral-600 text-white rounded-full text-[13px]"
                    >
                      −
                    </button>
                    <span className="text-white text-[12px]">{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.productId, item.size, 1)}
                      className="w-6 h-6 border border-neutral-600 text-white rounded-full text-[13px]"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-red-400 text-[11px] underline ml-auto"
                    >
                      Хасах
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4 text-white text-[14px] font-semibold border-t border-neutral-800 pt-4">
            <span>Нийт дүн</span>
            <span>{total.toLocaleString('mn-MN')}₮</span>
          </div>

          <button
            onClick={handleCheckoutClick}
            className="w-full bg-white text-black text-[12.5px] font-bold rounded-full py-3"
          >
            ЗАХИАЛГА ӨГӨХ
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Нэр"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
          />
          <input
            type="tel"
            placeholder="Утасны дугаар"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
          />
          <textarea
            placeholder="Хүргэлтийн хаяг"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none resize-none"
          />

          <div className="mt-2">
            <p className="text-neutral-400 text-[11px] mb-2">Төлбөр төлөх</p>
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
              <p className="text-white text-[13px] font-bold mb-3">Дансаар шилжүүлэх</p>
              <div className="text-neutral-300 text-[12px] leading-relaxed space-y-0.5">
                <p><span className="text-neutral-500">БАНКНЫ НЭР:</span> ХААН БАНК</p>
                <p><span className="text-neutral-500">ДАНСНЫ ДУГААР:</span> 5435108834</p>
                <p><span className="text-neutral-500">IBAN ДУГААР:</span> MN120005005435108834</p>
                <p><span className="text-neutral-500">ДАНСНЫ НЭР:</span> ХҮРЭЛМӨНХ МӨНХ-ОЧИР</p>
                <p className="mt-2">
                  <span className="text-neutral-500">ГҮЙЛГЭЭНИЙ УТГА:</span> Өөрийн утасны дугаар болон Instagram хаягаа бичнэ үү.
                </p>
              </div>
              <div className="border-t border-neutral-800 mt-3 pt-3">
                <p className="text-neutral-300 text-[12px] leading-relaxed">
                  Төлбөр шилжүүлсний дараа{' '}
                  <span className="text-white font-semibold">@chronicle.mongolia</span>{' '}
                  гэсэн Instagram хаягруу гүйлгээний screenshot илгээж захиалга баталгаажсан эсэхийг шалгана уу!
                </p>
                <p className="text-neutral-500 text-[11px] mt-2 italic">
                  Зөвхөн төлбөр төлөгдсөн захиалга баталгаажих болохыг анхаарна уу!
                </p>
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-[12px]">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-white text-black text-[12.5px] font-bold rounded-full py-3 mt-2 disabled:opacity-50"
          >
            {submitting ? 'Түр хүлээнэ үү...' : 'ЗАХИАЛГА БАТАЛГААЖУУЛАХ'}
          </button>

          <button
            onClick={() => setShowCheckout(false)}
            className="text-neutral-400 text-[12px] underline mx-auto"
          >
            Буцах
          </button>
        </div>
      )}
    </div>
  )
}