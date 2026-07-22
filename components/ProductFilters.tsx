'use client'

import { useState } from 'react'

export interface Filters {
  sizes: string[]
  stockStatus: 'all' | 'in_stock' | 'preorder'
  sortBy: 'newest' | 'price_asc' | 'price_desc'
  minPrice: string
  maxPrice: string
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

export const defaultFilters: Filters = {
  sizes: [],
  stockStatus: 'all',
  sortBy: 'newest',
  minPrice: '',
  maxPrice: '',
}

export default function ProductFilters({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Filters>(filters)

  const openSheet = () => {
    setDraft(filters)
    setOpen(true)
  }

  const apply = () => {
    onChange(draft)
    setOpen(false)
  }

  const clear = () => {
    setDraft(defaultFilters)
    onChange(defaultFilters)
    setOpen(false)
  }

  const toggleSize = (size: string) => {
    setDraft((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const activeCount =
    filters.sizes.length +
    (filters.stockStatus !== 'all' ? 1 : 0) +
    (filters.sortBy !== 'newest' ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0)

  return (
    <>
      <button
        onClick={openSheet}
        className="flex items-center gap-1.5 bg-neutral-900 text-white text-[11.5px] font-semibold rounded-full px-3.5 py-2 mb-4"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        Шүүлтүүр
        {activeCount > 0 && (
          <span className="bg-white text-black text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-sm bg-neutral-950 rounded-t-3xl flex flex-col"
            style={{ height: '70vh' }}
          >
            <div className="w-9 h-1 bg-neutral-700 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

            <div className="flex justify-between items-center px-4 pb-3 flex-shrink-0 border-b border-neutral-800">
              <h2 className="text-white font-bold text-[16px]">Шүүлтүүр</h2>
              <button onClick={() => setOpen(false)} className="text-neutral-400 text-[22px] leading-none px-1">
                ×
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-4 flex-1 min-h-0">
              <div className="mb-5">
                <p className="text-neutral-400 text-[11px] mb-2">Үнэ (₮)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Доод"
                    value={draft.minPrice}
                    onChange={(e) => setDraft({ ...draft, minPrice: e.target.value })}
                    className="w-full bg-neutral-900 text-white text-[13px] rounded-xl px-3 py-2.5 placeholder:text-neutral-500 outline-none"
                  />
                  <span className="text-neutral-600">—</span>
                  <input
                    type="number"
                    placeholder="Дээд"
                    value={draft.maxPrice}
                    onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })}
                    className="w-full bg-neutral-900 text-white text-[13px] rounded-xl px-3 py-2.5 placeholder:text-neutral-500 outline-none"
                  />
                </div>
              </div>

              <div className="mb-5">
                <p className="text-neutral-400 text-[11px] mb-2">Хэмжээ</p>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 h-8 rounded-full text-[11px] font-semibold ${
                        draft.sizes.includes(size)
                          ? 'bg-white text-black'
                          : 'text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-neutral-400 text-[11px] mb-2">Төлөв</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'all', label: 'Бүгд' },
                    { value: 'in_stock', label: 'Бэлэн байгаа' },
                    { value: 'preorder', label: 'Захиалгаар' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDraft({ ...draft, stockStatus: opt.value as Filters['stockStatus'] })}
                      className={`px-3 h-8 rounded-full text-[11px] font-semibold ${
                        draft.stockStatus === opt.value
                          ? 'bg-white text-black'
                          : 'text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-neutral-400 text-[11px] mb-2">Эрэмбэлэх</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'newest', label: 'Шинэ' },
                    { value: 'price_asc', label: 'Хямд → Үнэтэй' },
                    { value: 'price_desc', label: 'Үнэтэй → Хямд' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDraft({ ...draft, sortBy: opt.value as Filters['sortBy'] })}
                      className={`px-3 h-8 rounded-full text-[11px] font-semibold ${
                        draft.sortBy === opt.value
                          ? 'bg-white text-black'
                          : 'text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 px-4 py-4 border-t border-neutral-800 flex-shrink-0">
              <button
                onClick={clear}
                className="flex-1 border border-neutral-700 text-white text-[12.5px] font-semibold rounded-full py-3"
              >
                Цэвэрлэх
              </button>
              <button
                onClick={apply}
                className="flex-1 bg-white text-black text-[12.5px] font-bold rounded-full py-3"
              >
                Хэрэглэх
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}