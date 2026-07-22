export interface Product {
  id: string
  name: string
  price: number
  sizes: string[]
  description: string
  image_url: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  customer_name: string
  phone: string
  address: string
  payment_method: 'qpay' | 'bank'
  total: number
  status: 'pending' | 'done'
  created_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  size: string | null
  qty: number
  price: number
}

export interface Profile {
  id: string
  full_name: string
  phone: string
  is_admin: boolean
}