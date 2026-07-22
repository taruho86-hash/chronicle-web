'use client'

import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import ProductFilters, { Filters, defaultFilters } from './ProductFilters'

interface Product {
  id: string
  name: string
  price: number
  sizes: string[]
  image_url: string
  image_urls: string[]
  stock_status: string
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const filtered = useMemo(() => {
    let result = [...products]

    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes?.some((s) => filters.sizes.includes(s))
      )
    }

    if (filters.stockStatus !== 'all') {
      result = result.filter((p) => p.stock_status === filters.stockStatus)
    }

    if (filters.minPrice) {
      result = result.filter((p) => Number(p.price) >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter((p) => Number(p.price) <= Number(filters.maxPrice))
    }

    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price))
    }

    return result
  }, [products, filters])

  return (
    <div>
      <ProductFilters filters={filters} onChange={setFilters} />

      <p className="text-neutral-400 text-[11px] mb-4">{filtered.length} бараа</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500 text-[13px]">Тохирох бараа олдсонгүй.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}