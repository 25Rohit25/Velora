"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useUserStore } from "@/store/userStore"
import { format } from "date-fns"
import { Book, Sparkles, Camera } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface DiaryEntry {
    id: string
    created_at: string
    user_id: string
    prompt: string | null
    content: string
    image_url: string | null
    mood: string | null
}

interface Memory {
    id: string
    image_url: string
    frame_type: string
    note: string | null
    moment_date: string | null
}

export default function DiaryPage() {
    const { getJournalEntries, user, partner, profile } = useUserStore()
    const [entries, setEntries] = useState<DiaryEntry[]>([])
    const [memories, setMemories] = useState<Memory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            // Fetch diary entries
            const journalData = await getJournalEntries()
            if (journalData) setEntries(journalData)

            // Fetch memories for timeline integration
            if (profile?.couple_id) {
                const { data: memData } = await supabase
                    .from('memories')
                    .select('*')
                    .eq('couple_id', profile.couple_id)
                    .order('moment_date', { ascending: false })

                if (memData) setMemories(memData)
            }

            setLoading(false)
        }
        fetchData()
    }, [getJournalEntries, profile?.couple_id])

    // Combine and group by date
    const timelineItems = [
        ...entries.map(e => ({ type: 'entry' as const, date: e.created_at, data: e })),
        ...memories.map(m => ({ type: 'memory' as const, date: m.moment_date || m.created_at, data: m }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Group by date
    const groupedItems = timelineItems.reduce((acc: Record<string, typeof timelineItems>, item) => {
        const dateKey = format(new Date(item.date), 'yyyy-MM-dd')
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(item)
        return acc
    }, {})

    const sortedDates = Object.keys(groupedItems).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    )

    if (loading) return (
        <div className="min-h-screen pt-24 px-6 pb-32 flex flex-col items-center justify-center">
            <span className="text-4xl animate-pulse">📖</span>
        </div>
    )

    return (
        <div className="min-h-screen pt-6 px-6 pb-32">

            <header className="mb-8">
                <h1 className="font-serif text-3xl text-slate-800">Our Diary</h1>
                <p className="text-slate-500 text-sm mt-1">Something we'll read years later</p>
            </header>

            <div className="space-y-12">
                {timelineItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Book size={48} className="mb-4 text-slate-300" />
                        <p className="text-slate-400 text-center max-w-[200px]">
                            Your story is waiting to be written. Answer a prompt or add a memory.
                        </p>
                    </div>
                ) : (
                    sortedDates.map((date) => {
                        const items = groupedItems[date]

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
                                    {items.map((item, idx) => {
                                        if (item.type === 'entry') {
                                            const entry = item.data as DiaryEntry
                                            const isMe = entry.user_id === user?.id

                                            return (
                                                <div
                                                    key={entry.id}
                                                    className={cn(
                                                        "glass-card p-4 rounded-2xl relative group hover:bg-white/60 transition-colors",
                                                        isMe ? "rounded-tl-sm" : "rounded-tr-sm bg-white/40"
                                                    )}
                                                >
                                                    {/* Prompt */}
                                                    {entry.prompt && (
                                                        <div className="flex items-center gap-2 mb-3 text-rose-400">
                                                            <Sparkles size={14} />
                                                            <span className="text-xs font-medium italic">"{entry.prompt}"</span>
                                                        </div>
                                                    )}

                                                    {/* Author */}
                                                    <div className={cn("flex items-center gap-2 mb-2", !isMe && "justify-end")}>
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden border border-white">
                                                            {isMe && profile?.avatar_url && <img src={profile.avatar_url} className="w-full h-full object-cover" />}
                                                            {!isMe && partner?.avatar_url && <img src={partner.avatar_url} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-400">
                                                            {isMe ? "You" : partner?.nickname || "Partner"}
                                                        </span>
                                                    </div>

                                                    {/* Content */}
                                                    <p className={cn(
                                                        "text-slate-800 font-handwriting text-lg leading-relaxed",
                                                        !isMe && "text-right"
                                                    )}>
                                                        {entry.content}
                                                    </p>

                                                    {/* Mood Badge */}
                                                    {entry.mood && (
                                                        <div className="mt-2 inline-block px-2 py-1 bg-slate-50 rounded-full text-xs text-slate-500">
                                                            Feeling: {entry.mood}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        } else {
                                            const memory = item.data as Memory

                                            return (
                                                <div
                                                    key={memory.id}
                                                    className="flex items-start gap-3"
                                                >
                                                    <div className="flex items-center gap-1 text-rose-300 mt-1">
                                                        <Camera size={14} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <img
                                                            src={memory.image_url}
                                                            alt="Memory"
                                                            className="w-32 h-32 object-cover rounded-xl shadow-md"
                                                        />
                                                        {memory.note && (
                                                            <p className="mt-2 text-sm text-slate-600 font-handwriting italic">
                                                                "{memory.note}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
