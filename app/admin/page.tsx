'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  sizes: string[]
  description: string
  image_url: string
  image_urls: string[]
  stock_status: string
  size_stock: Record<string, string>
  is_featured: boolean
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

export default function AdminPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sizeStock, setSizeStock] = useState<Record<string, 'in_stock' | 'preorder'>>({})
  const [isFeatured, setIsFeatured] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()

      if (!profile?.is_admin) {
        router.push('/')
        return
      }
      setIsAdmin(true)
      setChecking(false)
      loadProducts()
    })
  }, [router])

  const loadProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data ?? [])
  }

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes((prev) => prev.filter((s) => s !== size))
      setSizeStock((prev) => {
        const next = { ...prev }
        delete next[size]
        return next
      })
    } else {
      setSelectedSizes((prev) => [...prev, size])
      setSizeStock((prev) => ({ ...prev, [size]: 'in_stock' }))
    }
  }

  const toggleSizeStatus = (size: string) => {
    setSizeStock((prev) => ({
      ...prev,
      [size]: prev[size] === 'in_stock' ? 'preorder' : 'in_stock',
    }))
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setImageFiles((prev) => [...prev, ...files])
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (imageFiles.length === 0 || !name || !price) {
      setError('Дор хаяж 1 зураг, нэр, үнэ заавал бөглөнө үү.')
      return
    }

    setUploading(true)
    const supabase = createClient()

    const uploadedUrls: string[] = []
    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file)

      if (uploadError) {
        setError('Зураг upload хийхэд алдаа гарлаа: ' + uploadError.message)
        setUploading(false)
        return
      }
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)
      uploadedUrls.push(urlData.publicUrl)
    }

    const allInStock =
      selectedSizes.length > 0 && selectedSizes.every((s) => sizeStock[s] === 'in_stock')

    const { error: insertError } = await supabase.from('products').insert({
      name,
      price: Number(price),
      sizes: selectedSizes,
      description,
      image_url: uploadedUrls[0],
      image_urls: uploadedUrls,
      stock_status: selectedSizes.length === 0 ? 'in_stock' : allInStock ? 'in_stock' : 'preorder',
      size_stock: sizeStock,
      is_featured: isFeatured,
    })

    if (insertError) {
      setError('Бараа нэмэхэд алдаа гарлаа: ' + insertError.message)
      setUploading(false)
      return
    }

    setName('')
    setPrice('')
    setDescription('')
    setSelectedSizes([])
    setSizeStock({})
    setIsFeatured(false)
    setImageFiles([])
    setImagePreviews([])
    setUploading(false)
    loadProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ барааг устгах уу?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    loadProducts()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('products').update({ is_featured: !current }).eq('id', id)
    loadProducts()
  }

  if (checking) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-neutral-500 text-[13px]">Түр хүлээнэ үү...</p>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="px-4 pt-8 pb-6 max-w-sm md:max-w-2xl mx-auto">
      <h1 className="text-white font-bold text-[22px] mb-1">АДМИН</h1>
      <p className="text-neutral-400 text-[11px] mb-6">Шинэ бараа нэмэх</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div>
          <p className="text-neutral-400 text-[11px] mb-2">Зураг (олон зураг сонгож болно)</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-[11px] flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center cursor-pointer text-neutral-500 text-[20px]">
              +
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <input
          type="text"
          placeholder="Барааны нэр"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
        />
        <input
          type="number"
          placeholder="Үнэ (₮)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
        />

        <div>
          <p className="text-neutral-400 text-[11px] mb-2">
            Хэмжээ сонгоод, тус бүрийн төлөвийг тохируулна уу
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3 h-9 rounded-full text-[11px] font-semibold ${
                  selectedSizes.includes(size)
                    ? 'bg-white text-black'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {selectedSizes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {selectedSizes.map((size) => (
                <div
                  key={size}
                  className="flex items-center justify-between bg-neutral-900 rounded-xl px-3 py-2"
                >
                  <span className="text-white text-[12px] font-semibold w-10">{size}</span>
                  <button
                    type="button"
                    onClick={() => toggleSizeStatus(size)}
                    className={`text-[10.5px] font-semibold px-3 py-1.5 rounded-full ${
                      sizeStock[size] === 'in_stock'
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {sizeStock[size] === 'in_stock' ? 'Бэлэн байгаа' : 'Захиалгаар'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2.5 bg-neutral-900 rounded-xl px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 accent-white"
          />
          <span className="text-white text-[12.5px]">
            Онцлох бараа болгох (Нүүр хуудсанд харагдана)
          </span>
        </label>

        <textarea
          placeholder="Тайлбар"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none resize-none"
        />

        {error && <p className="text-red-400 text-[12px]">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="bg-white text-black text-[12.5px] font-bold rounded-full py-3 disabled:opacity-50"
        >
          {uploading ? 'Түр хүлээнэ үү...' : 'НИЙТЛЭХ'}
        </button>
      </form>

      <h2 className="text-neutral-400 text-[11px] font-semibold tracking-wide mb-3">
        ОДОО БАЙГАА БАРАА ({products.length})
      </h2>
      <div className="flex flex-col gap-2.5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-neutral-900 rounded-xl p-3 flex gap-3 items-center"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-14 h-[70px] object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-white text-[13px] font-semibold truncate">
                {product.name}
              </div>
              <div className="text-neutral-400 text-[11px]">
                {Number(product.price).toLocaleString('mn-MN')}₮
              </div>
            </div>
            <button
              onClick={() => toggleFeatured(product.id, product.is_featured)}
              className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex-shrink-0 ${
                product.is_featured
                  ? 'bg-white text-black'
                  : 'text-neutral-400 border border-neutral-700'
              }`}
            >
              {product.is_featured ? 'Онцлох ✓' : 'Онцлох'}
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="text-red-400 text-[11px] underline flex-shrink-0"
            >
              Устгах
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}