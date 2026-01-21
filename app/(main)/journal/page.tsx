"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUserStore } from "@/store/userStore"
import { format } from "date-fns"
import { Book, Lock } from "lucide-react"

export default function JournalPage() {
    const { getJournalEntries, user, partner, profile } = useUserStore()
    const [entries, setEntries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEntries = async () => {
            const data = await getJournalEntries()
            if (data) setEntries(data)
            setLoading(false)
        }
        fetchEntries()
    }, [getJournalEntries])

    // Group entries by Date
    const groupedEntries = entries.reduce((acc: any, entry: any) => {
        const dateKey = format(new Date(entry.created_at), 'yyyy-MM-dd')
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(entry)
        return acc
    }, {})

    // Sort dates desc
    const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (loading) return (
        <div className="min-h-screen pt-24 px-6 pb-32 flex flex-col items-center justify-center">
            <span className="text-4xl animate-bounce">📖</span>
        </div>
    )

    return (
        <div className="min-h-screen pt-24 px-6 pb-32">

            <header className="mb-8">
                <h1 className="font-serif text-3xl text-slate-800">Our Story</h1>
                <p className="text-slate-500 text-sm mt-1">A timeline of your shared moments</p>
            </header>

            <div className="space-y-12">
                {entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Book size={48} className="mb-4 text-slate-300" />
                        <p className="text-slate-400">No memories yet. Answer a prompt!</p>
                    </div>
                ) : (
                    sortedDates.map((date) => {
                        const daysEntries = groupedEntries[date]
                        const myEntry = daysEntries.find((e: any) => e.user_id === user.id)
                        const partnerEntry = daysEntries.find((e: any) => e.user_id !== user.id)

                        // Check unlocked status: Partner's entry is locked if I haven't answered that day? 
                        // Simplified rule for now: If we both answered, or if it's my entry, show it.
                        // Actually, let's just show everything for now to keep it positive.

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={date}
                                className="relative pl-6 border-l-2 border-rose-100"
                            >
                                {/* Date Bubble */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-200 border-2 border-white" />

                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-2">
                                    {format(new Date(date), 'MMMM d, yyyy')}
                                </h3>

                                <div className="space-y-4">
                                    {/* Prompt Card (if prompt exists for this day) */}
                                    {daysEntries[0]?.prompt && (
                                        <div className="bg-rose-50/50 p-4 rounded-xl mb-4">
                                            <p className="font-serif italic text-slate-700 text-center">"{daysEntries[0].prompt}"</p>
                                        </div>
                                    )}

                                    {/* My Entry */}
                                    {myEntry && (
                                        <div className="glass-card p-4 rounded-2xl rounded-tl-sm relative group hover:bg-white/60 transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                                                    {profile?.avatar_url && <img src={profile.avatar_url} className="w-full h-full object-cover" />}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400">You</span>
                                            </div>
                                            <p className="text-slate-800 font-handwriting text-lg leading-relaxed">{myEntry.content}</p>
                                        </div>
                                    )}

                                    {/* Partner Entry */}
                                    {partnerEntry && (
                                        <div className="glass-card p-4 rounded-2xl rounded-tr-sm bg-white/40 relative">
                                            <div className="flex items-center justify-end gap-2 mb-2">
                                                <span className="text-xs font-bold text-slate-400">{partner?.nickname || "Partner"}</span>
                                                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                                                    {partner?.avatar_url && <img src={partner.avatar_url} className="w-full h-full object-cover" />}
                                                </div>
                                            </div>
                                            {/* Logic: Lock if I haven't answered? For now, show. */}
                                            <p className="text-slate-800 font-handwriting text-lg leading-relaxed text-right">{partnerEntry.content}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
