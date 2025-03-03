'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserContext } from '@/context/UserContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSubscription } from '@/hooks/useSubscription'

type FormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const router = useRouter()

  const [error, setError] = React.useState<string | null>(null)

  const { handleAuthChange } = useUserContext()
  const { isSubscribed, isLoading: isSubscriptionLoading } = useSubscription()

  const handleLogin = async (values: FormValues) => {
    try {
      const res = await fetch(`/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Invalid email or password')
      }

      handleAuthChange()
      
      // After successful login, check subscription status
      if (!isSubscribed && !isSubscriptionLoading) {
        router.push('/subscribe')
      } else {
        router.push('/bookings')
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <div className="container my-20">
      <div className="border max-w-[450px] mx-auto p-10 rounded-md bg-card">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md my-3">{error}</div>}
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl">Login</h1>
          <p className="text-muted-foreground text-lg">Login as a customer</p>
        </div>
        <form onSubmit={form.handleSubmit(handleLogin)} className="mt-5 space-y-3">
          <Input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            {...form.register('email')}
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete="password"
            {...form.register('password')}
          />

          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <div className="mt-5">
          <p className="text-center text-sm tracking-wide font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
