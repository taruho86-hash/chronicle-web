'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  price: number
  sizes: string[]
  image_url: string
  image_urls: string[]
  stock_status: string
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const images = product.image_urls?.length ? product.image_urls : [product.image_url]
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      size: selectedSize,
      image: images[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedSize(size)
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-neutral-900 rounded-2xl overflow-hidden flex flex-col transition-transform active:scale-[0.98] block"
    >
      <div className="relative w-full h-[220px] bg-neutral-800 overflow-hidden flex-shrink-0">
        {images[0] && (
          <img
            src={images[0]}
            alt={product.name}
            className="w-full h-full object-cover block"
          />
        )}

        {product.stock_status === 'preorder' ? (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9.5px] font-semibold px-2 py-1 rounded-full">
            Захиалгаар
          </div>
        ) : (
          <div className="absolute bottom-2 left-2 bg-white text-black text-[9.5px] font-semibold px-2 py-1 rounded-full">
            Бэлэн
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
            +{images.length - 1}
          </div>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-1">
          <span className="text-white text-[12px] font-semibold truncate">
            {product.name}
          </span>
          <span className="text-white text-[12px] font-semibold whitespace-nowrap">
            {Number(product.price).toLocaleString('mn-MN')}₮
          </span>
        </div>

        <div className="flex items-center justify-between">
          {product.sizes && product.sizes.length > 0 ? (
            <div className="flex gap-1.5 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeClick(e, size)}
                  className={`px-2 h-6 rounded-full text-[9.5px] font-semibold flex items-center justify-center ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={handleAdd}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              added ? 'bg-green-500' : 'bg-white'
            }`}
            aria-label="Сагсанд нэмэх"
          >
            {added ? (
              <span className="text-white text-[13px]">✓</span>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}