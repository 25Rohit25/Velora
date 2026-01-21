"use client"

import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { supabase } from '@/lib/supabase'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkSession, user } = useUserStore()

    useEffect(() => {
        // Check session on mount
        checkSession()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('Auth state changed:', event)
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    checkSession()
                } else if (event === 'SIGNED_OUT') {
                    useUserStore.setState({
                        user: null,
                        profile: null,
                        partner: null,
                        isAuthenticated: false
                    })
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return <>{children}</>
}
