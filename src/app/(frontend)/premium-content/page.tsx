'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/context/UserContext'
import { useSubscription } from '@/hooks/useSubscription'

export default function PremiumContentPage() {
  const router = useRouter()
  const { currentUser } = useUserContext()
  const { isSubscribed, isLoading, error } = useSubscription()

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!currentUser && !isLoading) {
      router.push('/login')
    }
  }, [currentUser, isLoading, router])

  // Redirect to subscribe page if not subscribed
  React.useEffect(() => {
    if (currentUser && !isLoading && !isSubscribed && !error) {
      router.push('/subscribe')
    }
  }, [currentUser, isSubscribed, isLoading, error, router])

  if (isLoading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Premium Content</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Premium Content</h1>
        <p className="text-error">Error: {error.message}</p>
      </div>
    )
  }

  if (!currentUser || !isSubscribed) {
    return null // Will be redirected by the useEffect hooks
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Premium Content</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Premium Content</h2>
        <p className="mb-4">
          Thank you for subscribing to our premium service! This content is only available to subscribers.
        </p>
        <p className="mb-4">
          Here you can access exclusive content, features, and benefits that are only available to our
          premium subscribers.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-3">Exclusive Feature 1</h3>
          <p>
            This is an exclusive feature that is only available to premium subscribers. It provides
            additional value and benefits.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-3">Exclusive Feature 2</h3>
          <p>
            This is another exclusive feature that is only available to premium subscribers. It provides
            additional value and benefits.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-3">Exclusive Feature 3</h3>
          <p>
            This is yet another exclusive feature that is only available to premium subscribers. It provides
            additional value and benefits.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-3">Exclusive Feature 4</h3>
          <p>
            This is one more exclusive feature that is only available to premium subscribers. It provides
            additional value and benefits.
          </p>
        </div>
      </div>
    </div>
  )
} 