'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          phone: phone,
        })
      }
      router.push('/profile')
      router.refresh()
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        setError('Имэйл эсвэл нууц үг буруу байна.')
        setLoading(false)
        return
      }
      router.push('/profile')
      router.refresh()
    }
  }

  return (
    <div className="px-4 pt-8 pb-6 max-w-sm md:max-w-md mx-auto md:pt-16">
      <h1 className="text-white font-bold text-[22px] mb-1">
        {mode === 'login' ? 'НЭВТРЭХ' : 'БҮРТГҮҮЛЭХ'}
      </h1>
      <p className="text-neutral-400 text-[11px] mb-6">
        {mode === 'login'
          ? 'Профайл, захиалгын түүхээ харах'
          : 'Шинэ хаяг үүсгэж захиалга хийж эхэлнэ үү'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'signup' && (
          <>
            <input
              type="text"
              placeholder="Нэр"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
            />
            <input
              type="tel"
              placeholder="Утасны дугаар"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
            />
          </>
        )}
        <input
          type="email"
          placeholder="Имэйл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
        />
        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-neutral-900 text-white text-[13px] rounded-xl px-4 py-3 placeholder:text-neutral-500 outline-none"
        />

        {error && <p className="text-red-400 text-[12px]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black text-[12.5px] font-bold rounded-full py-3 mt-2 disabled:opacity-50"
        >
          {loading ? 'Түр хүлээнэ үү...' : mode === 'login' ? 'НЭВТРЭХ' : 'БҮРТГҮҮЛЭХ'}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login')
          setError('')
        }}
        className="text-neutral-400 text-[12px] mt-5 underline block mx-auto"
      >
        {mode === 'login'
          ? 'Хаяг байхгүй юу? Бүртгүүлэх'
          : 'Хаягтай юу? Нэвтрэх'}
      </button>
    </div>
  )
}