import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      {/* HERO */}
      <div className="relative w-full h-[70vh] min-h-[420px] max-h-[640px] overflow-hidden md:rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200"
          alt="Chronicle"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 35%, rgba(10,10,10,1) 100%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 md:px-12 md:pb-14 max-w-2xl">
          <div className="text-neutral-300 text-[10px] md:text-[12px] tracking-[0.15em] font-semibold mb-2.5">
            2026 ОНЫ ХАВРЫН ЦУГЛУУЛГА
          </div>
          <h1 className="text-white font-extrabold text-[38px] md:text-[64px] leading-[0.95] mb-4">
            ШИНЭ
            <br />
            ХЭСЭГ
          </h1>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-black text-[12px] md:text-[14px] font-bold px-5 py-3 md:px-6 md:py-3.5 rounded-full"
          >
            Одоо үзэх
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* FEATURED */}
      {featured && featured.length > 0 && (
        <div className="px-4 md:px-8 pt-6">
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="text-white font-bold text-[16px] md:text-[20px]">Онцлох бараа</h2>
            <Link href="/products" className="text-neutral-400 text-[11px] md:text-[13px]">
              Бүгдийг үзэх →
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4">
            {featured.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="min-w-[130px] md:min-w-0 bg-neutral-900 rounded-2xl overflow-hidden flex-shrink-0"
              >
                <div className="relative h-[160px] md:h-[220px] bg-neutral-800">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.stock_status === 'preorder' ? (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[8.5px] font-semibold px-2 py-1 rounded-full">
                      Захиалгаар
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 bg-white text-black text-[8.5px] font-semibold px-2 py-1 rounded-full">
                      Бэлэн
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="text-white text-[11px] font-semibold truncate">
                    {product.name}
                  </div>
                  <div className="text-neutral-400 text-[10.5px]">
                    {Number(product.price).toLocaleString('mn-MN')}₮
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* INFO CARD */}
      <div className="px-4 md:px-8 py-6">
        <div className="bg-neutral-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="text-white text-[13px] md:text-[15px] font-bold mb-1">
              Хүргэлт Улаанбаатар даяар
            </div>
            <div className="text-neutral-400 text-[11px] md:text-[12.5px]">
              1-2 хоногийн дотор гэрт хүргэнэ
            </div>
          </div>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="1" y="6" width="15" height="12" rx="1" />
            <path d="M16 10h4l3 3v5h-7z" />
            <circle cx="6" cy="20" r="2" />
            <circle cx="18" cy="20" r="2" />
          </svg>
        </div>
      </div>
    </div>
  )
}