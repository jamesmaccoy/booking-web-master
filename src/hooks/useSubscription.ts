'use client'

import { useEffect, useState } from 'react'
import { useRevenueCat } from '@/providers/RevenueCat'

export type SubscriptionStatus = {
  isSubscribed: boolean
  entitlements: string[]
  expirationDate: Date | null
  isLoading: boolean
  error: Error | null
}

export const useSubscription = (entitlementId?: string): SubscriptionStatus => {
  const { customerInfo, isLoading, error } = useRevenueCat()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    entitlements: [],
    expirationDate: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (isLoading || !customerInfo) {
      setSubscriptionStatus(prev => ({ ...prev, isLoading }))
      return
    }

    try {
      // Extract entitlements from customer info
      const entitlements = customerInfo.entitlements || {}
      const activeEntitlements = Object.keys(entitlements).filter(
        key => entitlements[key]?.isActive
      )

      // Check if the user has the specific entitlement or any entitlement
      const isSubscribed = entitlementId
        ? activeEntitlements.includes(entitlementId)
        : activeEntitlements.length > 0

      // Get expiration date of the entitlement
      let expirationDate: Date | null = null
      if (entitlementId && entitlements[entitlementId]?.expirationDate) {
        expirationDate = new Date(entitlements[entitlementId].expirationDate)
      } else if (activeEntitlements.length > 0 && entitlements[activeEntitlements[0]]?.expirationDate) {
        expirationDate = new Date(entitlements[activeEntitlements[0]].expirationDate)
      }

      setSubscriptionStatus({
        isSubscribed,
        entitlements: activeEntitlements,
        expirationDate,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error checking subscription status:', err)
      setSubscriptionStatus(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Unknown error checking subscription status'),
      }))
    }
  }, [customerInfo, isLoading, entitlementId, error])

  return subscriptionStatus
} 