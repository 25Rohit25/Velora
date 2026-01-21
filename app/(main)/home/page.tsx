"use client"

import { useState, useEffect } from "react"
import MoodSelector from "@/components/home/MoodSelector"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Heart, Mic, Camera, Zap } from "lucide-react"
import StickyNote from "@/components/home/StickyNote"
import { useUserStore } from "@/store/userStore"
import { cn } from "@/lib/utils"

export default function HomePage() {
    const { user, profile, partner, updateMood, sendPulse, subscribeToRealtime, addJournalEntry } = useUserStore()
    const [isPulsing, setIsPulsing] = useState(false)
    const [partnerPulse, setPartnerPulse] = useState(false)
    const [isAnswering, setIsAnswering] = useState(false)
    const [answer, setAnswer] = useState("")

    // Real-time Subscription
    useEffect(() => {
        const unsubscribe = subscribeToRealtime()
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [subscribeToRealtime])

    // Check for Pulse from Partner (Simple polling/effect for demo, ideally reactive)
    useEffect(() => {
        if (partner?.last_pulse) {
            const lastPulseTime = new Date(partner.last_pulse).getTime()
            const now = new Date().getTime()
            // If pulse was within last 10 seconds (in reality we'd trigger this via event, but this works for persistent state)
            if (now - lastPulseTime < 10000) {
                setPartnerPulse(true)
                const timer = setTimeout(() => setPartnerPulse(false), 3000)
                return () => clearTimeout(timer)
            }
        }
    }, [partner?.last_pulse])

    const handlePulse = async () => {
        setIsPulsing(true)
        await sendPulse() // Fire and forget
        setTimeout(() => setIsPulsing(false), 2000)
    }

    const Avatar = ({ userProfile, isYou = false, isPulsing = false }: any) => {
        const moodColor = userProfile?.current_mood?.color || "from-slate-200 to-slate-200"
        const moodEmoji = userProfile?.current_mood?.emoji || (isYou ? "😌" : "😶")

        return (
            <div className="flex flex-col items-center gap-3 relative">
                {/* Pulse Ring */}
                {isPulsing && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-0 w-24 h-24 rounded-full bg-rose-400 -z-10"
                    />
                )}

                <div className="relative">
                    <div className={cn(
                        "w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr transition-all duration-700 shadow-lg",
                        moodColor
                    )}>
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                            {userProfile?.avatar_url ? (
                                <img src={userProfile.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-slate-300">
                                    {(userProfile?.nickname || "?")[0]?.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Mood Badge */}
                    <motion.div
                        key={moodEmoji}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-md border-2 border-slate-50"
                    >
                        {moodEmoji}
                    </motion.div>
                </div>
                <p className="font-serif text-lg text-slate-700">{userProfile?.nickname || (isYou ? "You" : "Partner")}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full pb-32 pt-8 px-4 overflow-hidden relative">

            {/* Header: Avatars "Us" */}
            <div className="flex items-center justify-center gap-8 mt-4 mb-8">
                <Avatar userProfile={profile} isYou={true} isPulsing={isPulsing} />

                {/* Connection Line */}
                <div className="h-[2px] w-12 bg-slate-200 rounded-full relative overflow-hidden">
                    {partner && (
                        <motion.div
                            className="absolute top-0 left-0 h-full w-full bg-rose-300"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    )}
                </div>

                <Avatar userProfile={partner} isYou={false} isPulsing={partnerPulse} />
            </div>

            {/* Content Container */}
            <div className="max-w-md mx-auto space-y-6">

                {/* The Fridge (Sticky Note) */}
                <StickyNote />

                {/* Pulse Button: Think of You */}
                {partner && (
                    <div className="flex flex-col items-center">
                        <p className="text-xs text-slate-400 mb-3 font-medium tracking-wide">
                            {partnerPulse ? `${partner.nickname} is thinking of you!` : "Let them know you're thinking of them"}
                        </p>
                        <button
                            onClick={handlePulse}
                            disabled={isPulsing}
                            className="group relative px-6 py-2 rounded-full glass-card hover:bg-white/60 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Heart
                                size={20}
                                className={cn("transition-colors", isPulsing ? "fill-rose-500 text-rose-500" : "fill-rose-100 text-rose-300 group-hover:text-rose-400")}
                            />
                            <span className="text-sm font-medium text-slate-600">
                                {isPulsing ? "Sent!" : "Send Love"}
                            </span>
                        </button>

                        {/* Giant Graphic Overlay for Partner Pulse */}
                        <AnimatePresence>
                            {partnerPulse && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                                >
                                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-full shadow-2xl flex flex-col items-center">
                                        <Heart size={64} className="fill-rose-400 text-rose-400 animate-bounce" />
                                        <p className="text-lg font-display font-bold text-slate-800 mt-4">{partner?.nickname} sent love!</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Mood Selector - Now Real */}
                <MoodSelector
                    onMoodChange={updateMood}
                    currentMood={profile?.current_mood}
                />

                {/* Daily Prompt */}
                <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden text-center group transition-all duration-500 hover:shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-rose-200 to-indigo-200" />

                    <AnimatePresence mode="wait">
                        {!isAnswering ? (
                            <motion.div
                                key="prompt"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-4xl block mb-4 animate-bounce-slow">✨</span>
                                <p className="font-serif text-lg text-slate-700 italic mb-6 leading-relaxed">
                                    "What is your favorite memory of us from last month?"
                                </p>
                                <button
                                    onClick={() => setIsAnswering(true)}
                                    className="text-sm font-bold text-slate-500 bg-white/50 hover:bg-white border border-slate-200 px-6 py-3 rounded-full transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Zap size={16} className="text-orange-400 fill-orange-400" /> Answer to Unlock
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="answering"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full text-left"
                            >
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Your Answer</p>
                                <textarea
                                    className="w-full h-24 bg-white/50 rounded-xl p-3 text-slate-700 placeholder:text-slate-400 border-none focus:ring-2 ring-rose-200 resize-none outline-none text-base"
                                    placeholder="Type something sweet..."
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-2 mt-3">
                                    <button
                                        className="flex-1 bg-rose-400 hover:bg-rose-500 text-white font-bold py-2 rounded-xl transition-colors text-sm disabled:opacity-50"
                                        disabled={!answer.trim()}
                                        onClick={async () => {
                                            if (!answer.trim()) return
                                            await addJournalEntry(answer, "What is your favorite memory of us from last month?")
                                            setIsAnswering(false)
                                            setAnswer("")
                                            // Optionally show success or refetch
                                            alert("Saved to Journal! 💖")
                                        }}
                                    >
                                        Share
                                    </button>
                                    <button
                                        onClick={() => setIsAnswering(false)}
                                        className="px-4 py-2 text-slate-400 hover:text-slate-600 font-medium text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}

