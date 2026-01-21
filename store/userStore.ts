import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface UserState {
    user: any | null
    profile: any | null
    partner: any | null
    isAuthenticated: boolean
    isLoading: boolean

    stickyNote: any | null
    messages: any[]

    // Actions
    checkSession: () => Promise<void>
    signUp: (email: string, password: string) => Promise<any>
    signIn: (email: string, password: string) => Promise<any>
    signOut: () => Promise<void>
    updateProfile: (data: any) => Promise<void>
    generatePairingCode: () => Promise<any>
    linkByPairingCode: (code: string) => Promise<any>
    updateMood: (mood: any) => Promise<void>
    sendPulse: () => Promise<void>
    updateStickyNote: (note: any) => Promise<void>
    getJournalEntries: () => Promise<any[]>
    addJournalEntry: (content: string, prompt?: string) => Promise<any>
    getMessages: () => Promise<void>
    sendMessage: (content: string, type?: string) => Promise<void>
    subscribeToRealtime: () => (() => void) | undefined
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    profile: null,
    partner: null,
    stickyNote: null,
    messages: [],
    isAuthenticated: false,
    isLoading: true,

    checkSession: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                // Fetch partner & couple data (Sticky Note)
                let partnerData = null
                let stickyNoteData = null

                if (profile?.partner_id) {
                    const { data: partner } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', profile.partner_id)
                        .single()
                    partnerData = partner
                }

                if (profile?.couple_id) {
                    const { data: couple } = await supabase
                        .from('couples')
                        .select('sticky_note')
                        .eq('id', profile.couple_id)
                        .single()
                    stickyNoteData = couple?.sticky_note
                }

                set({
                    user: session.user,
                    profile,
                    partner: partnerData,
                    stickyNote: stickyNoteData,
                    isAuthenticated: true
                })
            }
        } catch (error) {
            console.error('Session check failed', error)
        } finally {
            set({ isLoading: false })
        }
    },

    signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    },

    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (data.session) {
            get().checkSession()
        }
        return { data, error }
    },

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null, isAuthenticated: false })
    },

    updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return

        const { error } = await supabase
            .from('profiles')
            .upsert({ id: user.id, ...updates })

        if (!error) {
            set(state => ({ profile: { ...state.profile, ...updates } }))
        }
    },

    generatePairingCode: async () => {
        const { user } = get()
        if (!user) return { error: 'No user' }

        // 1. Generate Code
        const code = "LOVE-" + Math.floor(1000 + Math.random() * 9000)

        // 2. Create Couple Entry
        // This user is user_1
        const { data: couple, error: coupleError } = await supabase
            .from('couples')
            .insert({
                pairing_code: code,
                user_1_id: user.id
            })
            .select()
            .single()

        if (coupleError) return { error: coupleError }

        // 3. Update Profile with couple_id
        await supabase
            .from('profiles')
            .update({ couple_id: couple.id })
            .eq('id', user.id)

        return { code }
    },

    linkByPairingCode: async (code: string) => {
        const { user } = get()
        if (!user) return { error: 'No user' }

        // 1. Find Couple
        const { data: couple, error: findError } = await supabase
            .from('couples')
            .select('*')
            .eq('pairing_code', code)
            .single()

        if (findError || !couple) return { error: 'Invalid code' }
        if (couple.user_2_id) return { error: 'Code already used' }

        // 2. Update Couple (Add user_2)
        const { error: updateError } = await supabase
            .from('couples')
            .update({ user_2_id: user.id })
            .eq('id', couple.id)

        if (updateError) return { error: updateError }

        // 3. Update BOTH Profiles (Link them)
        // My Profile
        await supabase
            .from('profiles')
            .update({
                couple_id: couple.id,
                partner_id: couple.user_1_id
            })
            .eq('id', user.id)

        // Partner Profile
        await supabase
            .from('profiles')
            .update({ partner_id: user.id })
            .eq('id', couple.user_1_id)

        // 4. Update local state
        set({ partner: { id: couple.user_1_id } }) // Simplified

        return { success: true }
    },

    updateMood: async (mood: any) => {
        const { user } = get()
        if (!user) return

        // Optimistic update
        set(state => ({ profile: { ...state.profile, current_mood: mood } }))

        await supabase
            .from('profiles')
            .update({ current_mood: mood })
            .eq('id', user.id)
    },

    sendPulse: async () => {
        const { user } = get()
        if (!user) return

        const timestamp = new Date().toISOString()

        await supabase
            .from('profiles')
            .update({ last_pulse: timestamp })
            .eq('id', user.id)
    },

    updateStickyNote: async (note: any) => {
        const { profile } = get()
        if (!profile?.couple_id) return

        // Optimistic
        set({ stickyNote: note })

        await supabase
            .from('couples')
            .update({ sticky_note: note })
            .eq('id', profile.couple_id)
    },

    getJournalEntries: async (): Promise<any[]> => {
        const { profile } = get()
        if (!profile?.couple_id) return []

        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('couple_id', profile.couple_id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            return data
        }
        return []
    },

    addJournalEntry: async (content: string, prompt: string = "") => {
        const { user, profile } = get()
        if (!user || !profile?.couple_id) return

        const { data, error } = await supabase
            .from('journal_entries')
            .insert({
                couple_id: profile.couple_id,
                user_id: user.id,
                content,
                prompt
            })
            .select()
            .single()

        return { data, error }
    },

    getMessages: async () => {
        const { profile } = get()
        if (!profile?.couple_id) return

        const { data, error } = await supabase
            .from('messages')
            .select('*, sender:sender_id(nickname, avatar_url)')
            .eq('couple_id', profile.couple_id)
            .order('created_at', { ascending: true })
            .limit(50)

        if (!error && data) {
            set({ messages: data })
        }
    },

    sendMessage: async (content: string, type: string = 'text') => {
        const { user, profile } = get()
        if (!user || !profile?.couple_id) return

        // Optimistic UI (optional, but good for "advanced" feel)
        const optimisticMsg = {
            id: 'temp-' + Date.now(),
            content,
            type,
            sender_id: user.id,
            created_at: new Date().toISOString(),
            sender: { nickname: profile.nickname, avatar_url: profile.avatar_url }
        }
        set(state => ({ messages: [...state.messages, optimisticMsg] }))

        const { error } = await supabase
            .from('messages')
            .insert({
                couple_id: profile.couple_id,
                sender_id: user.id,
                content,
                type
            })

        if (error) {
            console.error(error)
            // Rollback implementation omitted for brevity
        }
    },

    // Realtime Listener
    subscribeToRealtime: () => {
        const { user, profile } = get()
        if (!user || !profile?.partner_id) return

        const channel = supabase
            .channel('room1')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${profile.partner_id}` },
                (payload) => {
                    console.log('Partner Updated:', payload.new)
                    set({ partner: payload.new })
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'couples', filter: `id=eq.${profile.couple_id}` },
                (payload) => {
                    console.log('Couple/Note Updated:', payload.new)
                    if (payload.new.sticky_note) {
                        set({ stickyNote: payload.new.sticky_note })
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `couple_id=eq.${profile.couple_id}` },
                async (payload) => {
                    // Check if we already have this ID (from optimistic update)
                    // If not, append it.
                    // We need to fetch the sender info usually, or just assume it's partner if not us.
                    const { user } = get()
                    if (payload.new.sender_id === user.id) return // Ignore our own echo (handled optimistically)

                    // For partner messages, we need nickname/avatar. Since we have partner in state:
                    const { partner } = get()
                    const newMsg = {
                        ...payload.new,
                        sender: { nickname: partner?.nickname, avatar_url: partner?.avatar_url }
                    }
                    set(state => ({ messages: [...state.messages, newMsg] }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }
}))
