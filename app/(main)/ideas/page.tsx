"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, Heart, RefreshCw, Sparkles } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { cn } from "@/lib/utils"

// Gentle, pressure-free date ideas organized by category
const DATE_IDEAS = {
    quiet: [
        { emoji: "🌙", title: "Stargazing from Home", description: "Turn off the lights, open a window, and just be together under the stars." },
        { emoji: "📚", title: "Read Together", description: "Pick a book you both love, or read to each other. No phones." },
        { emoji: "🛁", title: "Relaxing Bath", description: "Light some candles, add bubbles, and unwind together." },
        { emoji: "🎧", title: "Music & Cuddles", description: "Create a playlist of songs that remind you of each other. Just listen." },
    ],
    outdoor: [
        { emoji: "🌅", title: "Sunrise or Sunset", description: "Wake up early or stay up late. Watch the sky change colors together." },
        { emoji: "🚶", title: "Evening Walk", description: "No destination. Just walk, talk, and hold hands." },
        { emoji: "🧺", title: "Simple Picnic", description: "Pack whatever you have. The location matters less than the company." },
    ],
    playful: [
        { emoji: "🎮", title: "Game Night", description: "Board games, video games, or make up your own silly rules." },
        { emoji: "🍳", title: "Cook Together", description: "Try a new recipe. It doesn't have to be perfect." },
        { emoji: "💃", title: "Living Room Dance", description: "Put on your favorite song and just dance. No one's watching." },
        { emoji: "🖌️", title: "Create Something", description: "Draw each other, build with LEGOs, or try origami together." },
    ],
    reconnect: [
        { emoji: "💌", title: "Write a Letter", description: "Write what you appreciate about them. Read it aloud or leave it as a surprise." },
        { emoji: "📷", title: "Memory Lane", description: "Look through old photos together. Remember where you started." },
        { emoji: "🙏", title: "Gratitude Share", description: "Take turns saying one thing you're grateful for about each other." },
        { emoji: "🤫", title: "Quiet Time Together", description: "Just sit together. No talking required. Presence is enough." },
    ],
}

const MOOD_SUGGESTIONS: Record<string, string[]> = {
    tired: ["quiet", "reconnect"],
    stressed: ["quiet", "outdoor"],
    happy: ["playful", "outdoor"],
    romantic: ["reconnect", "quiet"],
    bored: ["playful", "outdoor"],
}

export default function IdeasPage() {
    const { profile, partner } = useUserStore()
    const [currentIdea, setCurrentIdea] = useState<typeof DATE_IDEAS.quiet[0] | null>(null)
    const [category, setCategory] = useState<keyof typeof DATE_IDEAS>("quiet")
    const [isShuffling, setIsShuffling] = useState(false)

    // Get a random idea
    const getRandomIdea = () => {
        setIsShuffling(true)
        const ideas = DATE_IDEAS[category]
        const randomIndex = Math.floor(Math.random() * ideas.length)
        setTimeout(() => {
            setCurrentIdea(ideas[randomIndex])
            setIsShuffling(false)
        }, 400)
    }

    // Initialize with a random idea
    useEffect(() => {
        getRandomIdea()
    }, [category])

    // Detect mood and suggest category
    useEffect(() => {
        const userMood = profile?.current_mood?.label?.toLowerCase()
        if (userMood && MOOD_SUGGESTIONS[userMood]) {
            const suggestions = MOOD_SUGGESTIONS[userMood]
            setCategory(suggestions[0] as keyof typeof DATE_IDEAS)
        }
    }, [profile?.current_mood])

    return (
        <div className="min-h-screen pt-6 px-6 pb-32">
            <header className="mb-8">
                <h1 className="font-serif text-3xl text-slate-800">Ideas for Us</h1>
                <p className="text-slate-500 text-sm mt-1">Gentle suggestions, never pressure</p>
            </header>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
                {Object.keys(DATE_IDEAS).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat as keyof typeof DATE_IDEAS)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            category === cat
                                ? "bg-rose-400 text-white shadow-md"
                                : "bg-white/60 text-slate-500 hover:bg-rose-50"
                        )}
                    >
                        {cat === "quiet" && "🌙 At Home"}
                        {cat === "outdoor" && "🌿 Outside"}
                        {cat === "playful" && "🎮 Playful"}
                        {cat === "reconnect" && "💕 Reconnect"}
                    </button>
                ))}
            </div>

            {/* Main Idea Card */}
            <AnimatePresence mode="wait">
                {currentIdea && (
                    <motion.div
                        key={currentIdea.title}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="glass-card p-8 rounded-3xl text-center relative overflow-hidden"
                    >
                        {/* Decorative sparkle */}
                        <Sparkles size={16} className="absolute top-4 right-4 text-rose-200" />

                        <motion.div
                            className="text-6xl mb-6"
                            animate={{ scale: isShuffling ? [1, 1.2, 1] : 1 }}
                        >
                            {currentIdea.emoji}
                        </motion.div>

                        <h2 className="font-serif text-2xl text-slate-800 mb-3">
                            {currentIdea.title}
                        </h2>

                        <p className="text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                            {currentIdea.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shuffle Button */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={getRandomIdea}
                    disabled={isShuffling}
                    className="flex items-center gap-2 px-6 py-3 bg-white/60 hover:bg-white text-slate-600 rounded-full font-medium transition-all shadow-sm"
                >
                    <RefreshCw size={18} className={cn(isShuffling && "animate-spin")} />
                    Another Idea
                </button>
            </div>

            {/* Gentle Note */}
            {profile?.current_mood && (
                <div className="mt-12 p-4 bg-rose-50/50 rounded-2xl flex items-start gap-3">
                    <Lightbulb size={20} className="text-rose-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-500">
                        We noticed you're feeling <span className="font-medium text-slate-600">{profile.current_mood.label}</span> today.
                        These ideas might fit your mood. No pressure — just gentle suggestions.
                    </p>
                </div>
            )}

            {/* Philosophy Note */}
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-300 max-w-[220px] mx-auto">
                    Connection doesn't require grand gestures. Sometimes presence is enough.
                </p>
            </div>
        </div>
    )
}
