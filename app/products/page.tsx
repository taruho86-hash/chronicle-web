import { createClient } from '@/lib/supabase'
import ProductGrid from '@/components/ProductGrid'

export default async function ProductsPage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="px-4 md:px-8 pt-6 pb-6 max-w-md md:max-w-5xl mx-auto">
      <h1 className="text-white font-bold text-[22px] mb-4">БАРАА</h1>
      <ProductGrid products={products ?? []} />
    </div>
  )
}