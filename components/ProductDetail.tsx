'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  price: number
  sizes: string[]
  description: string
  image_url: string
  image_urls: string[]
  stock_status: string
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const images = product.image_urls?.length ? product.image_urls : [product.image_url]
  const [imgIndex, setImgIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      size: selectedSize,
      image: images[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const prevImage = () => {
    setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  const nextImage = () => {
    setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="max-w-sm md:max-w-3xl mx-auto pb-6 md:grid md:grid-cols-2 md:gap-8 md:pt-8">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center md:relative md:top-0 md:left-0 md:mb-4"
        aria-label="Буцах"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="relative w-full aspect-[4/5] bg-neutral-800 overflow-hidden md:rounded-2xl md:self-start">
        {images[imgIndex] && (
          <img
            src={images[imgIndex]}
            alt={product.name}
            className="w-full h-full object-cover block"
          />
        )}

        {product.stock_status === 'preorder' ? (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full">
            Захиалгаар
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-semibold px-2.5 py-1.5 rounded-full">
            Бэлэн байгаа
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"
              aria-label="Өмнөх зураг"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"
              aria-label="Дараагийн зураг"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === imgIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-4 md:px-0 pt-4 md:pt-0">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-white font-bold text-[18px] md:text-[24px]">{product.name}</h1>
          <span className="text-white font-bold text-[16px] md:text-[20px] whitespace-nowrap ml-2">
            {Number(product.price).toLocaleString('mn-MN')}₮
          </span>
        </div>

        {product.description && (
          <p className="text-neutral-400 text-[12.5px] md:text-[14px] leading-relaxed mt-3 mb-5">
            {product.description}
          </p>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-5">
            <p className="text-neutral-400 text-[11px] mb-2">Хэмжээ сонгох</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 rounded-full text-[12px] font-semibold ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'text-neutral-300 border border-neutral-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-bold transition-colors ${
            added ? 'bg-green-500 text-white' : 'bg-white text-black'
          }`}
        >
          {added ? (
            'Нэмэгдлээ ✓'
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Сагсанд нэмэх
            </>
          )}
        </button>
      </div>
    </div>
  )
}