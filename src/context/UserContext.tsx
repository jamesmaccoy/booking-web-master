'use client'

import { User } from '@/payload-types'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type UserContextType = {
  currentUser: User | null
  handleAuthChange: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const fetchCurrentUser = useCallback(async () => {
    const req = await fetch(`/api/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await req.json()

    setCurrentUser(data?.user || null)
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const handleAuthChange = () => {
    fetchCurrentUser()
  }

  return <UserContext value={{ currentUser, handleAuthChange }}>{children}</UserContext>
}

export const useUserContext = () => {
  const ctx = useContext(UserContext)

  if (!ctx) {
    throw new Error('useUserContext must be used within a UserProvider')
  }

  return ctx
}
