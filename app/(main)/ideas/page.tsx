"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import {
    Lightbulb, Heart, RefreshCw, Sparkles, Star, Send,
    Wand2, CheckCircle2, BookmarkPlus, Trophy, Calendar,
    MessageCircle, Loader2, X, ChevronRight, Flame, Clock
} from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { cn } from "@/lib/utils"

// Curated date ideas
const DATE_IDEAS = {
    quiet: [
        { emoji: "🌙", title: "Stargazing from Home", description: "Turn off the lights and be together under the stars.", color: "from-indigo-400 to-purple-500" },
        { emoji: "📚", title: "Read Together", description: "Pick a book you both love, or read to each other.", color: "from-amber-400 to-orange-500" },
        { emoji: "🛁", title: "Relaxing Bath", description: "Light candles, add bubbles, and unwind together.", color: "from-cyan-400 to-blue-500" },
        { emoji: "🎧", title: "Music & Cuddles", description: "Create a playlist of songs that remind you of each other.", color: "from-pink-400 to-rose-500" },
    ],
    outdoor: [
        { emoji: "🌅", title: "Sunrise or Sunset", description: "Watch the sky change colors together.", color: "from-orange-400 to-red-500" },
        { emoji: "🚶", title: "Evening Walk", description: "No destination. Just walk, talk, and hold hands.", color: "from-emerald-400 to-teal-500" },
        { emoji: "🧺", title: "Simple Picnic", description: "Pack whatever you have. Company matters most.", color: "from-lime-400 to-green-500" },
    ],
    playful: [
        { emoji: "🎮", title: "Game Night", description: "Board games, video games, or make up silly rules.", color: "from-blue-400 to-indigo-500" },
        { emoji: "🍳", title: "Cook Together", description: "Try a new recipe. It doesn't have to be perfect.", color: "from-yellow-400 to-amber-500" },
        { emoji: "💃", title: "Living Room Dance", description: "Put on your favorite song and just dance.", color: "from-fuchsia-400 to-pink-500" },
    ],
    reconnect: [
        { emoji: "💌", title: "Write a Letter", description: "Write what you appreciate about them.", color: "from-rose-400 to-pink-500" },
        { emoji: "📷", title: "Memory Lane", description: "Look through old photos together.", color: "from-amber-400 to-yellow-500" },
        { emoji: "💕", title: "Future Dreams", description: "Talk about your dreams together.", color: "from-pink-400 to-rose-500" },
    ],
}

// Couple Questions for deeper connection
const COUPLE_QUESTIONS = [
    "What's one thing I do that makes you feel most loved?",
    "If we could travel anywhere tomorrow, where would you want to go?",
    "What's your favorite memory of us?",
    "What's something you've always wanted to try together?",
    "What made you smile today?",
    "What's one thing you're grateful for about us?",
    "If we had a whole weekend with no plans, what would you want to do?",
    "What's a small thing I could do to make your day better?",
    "What song reminds you of us?",
    "What's something new you want to learn together?",
]

// Couple Challenges
const COUPLE_CHALLENGES = [
    { emoji: "📵", title: "No Phones Evening", description: "Put phones away for 3 hours tonight", difficulty: "Easy" },
    { emoji: "💌", title: "Love Note Exchange", description: "Write each other a surprise note", difficulty: "Easy" },
    { emoji: "🍳", title: "Cook Without Recipe", description: "Make dinner without looking anything up", difficulty: "Medium" },
    { emoji: "🎨", title: "Draw Each Other", description: "5 minutes to draw your partner (no peeking!)", difficulty: "Fun" },
    { emoji: "🌅", title: "Sunrise Date", description: "Wake up early and watch sunrise together", difficulty: "Hard" },
]

const CATEGORIES = [
    { key: "quiet", label: "At Home", emoji: "🏠" },
    { key: "outdoor", label: "Outside", emoji: "🌿" },
    { key: "playful", label: "Playful", emoji: "🎮" },
    { key: "reconnect", label: "Reconnect", emoji: "💕" },
]

export default function IdeasPage() {
    const { profile, partner } = useUserStore()
    const [currentIdea, setCurrentIdea] = useState<typeof DATE_IDEAS.quiet[0] | null>(null)
    const [category, setCategory] = useState<keyof typeof DATE_IDEAS>("quiet")
    const [isShuffling, setIsShuffling] = useState(false)
    const [activeTab, setActiveTab] = useState<"ideas" | "questions" | "challenges" | "ai">("ideas")
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [savedIdeas, setSavedIdeas] = useState<string[]>([])

    // AI Chat
    const [aiPrompt, setAiPrompt] = useState("")
    const [aiResponse, setAiResponse] = useState("")
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

    // Mouse parallax
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 })
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set((e.clientX - window.innerWidth / 2) / 50)
            mouseY.set((e.clientY - window.innerHeight / 2) / 50)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const getRandomIdea = () => {
        setIsShuffling(true)
        const ideas = DATE_IDEAS[category]
        const randomIndex = Math.floor(Math.random() * ideas.length)
        setTimeout(() => {
            setCurrentIdea(ideas[randomIndex])
            setIsShuffling(false)
        }, 400)
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        getRandomIdea()
    }, [category])

    const nextQuestion = () => {
        setCurrentQuestion((prev) => (prev + 1) % COUPLE_QUESTIONS.length)
    }

    const saveIdea = (title: string) => {
        if (savedIdeas.includes(title)) {
            setSavedIdeas(savedIdeas.filter(i => i !== title))
        } else {
            setSavedIdeas([...savedIdeas, title])
        }
    }

    // AI Suggestion (simulated - in production connect to Gemini API)
    const getAiSuggestion = async () => {
        if (!aiPrompt.trim()) return

        setIsAiLoading(true)
        setAiResponse("")

        try {
            const response = await fetch('/api/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    partnerName: partner?.nickname || 'your partner'
                })
            })

            const data = await response.json()

            if (data.error) {
                setAiResponse(`❌ ${data.error}\n\nMake sure your GEMINI_API_KEY is set in .env.local`)
            } else {
                setAiResponse(data.suggestion)
            }
        } catch (error: any) {
            setAiResponse(`❌ Failed to connect to AI: ${error?.message}`)
        }

        setIsAiLoading(false)
        setAiPrompt("")
    }

    // Quick AI suggestions
    const quickSuggestions = [
        "Fun activity for a rainy day",
        "Date idea under $10",
        "Something romantic but simple",
        "Ways to reconnect after a busy week"
    ]

    return (
        <div className="min-h-screen pb-32 overflow-hidden relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50/80 to-violet-50" />

                {mounted && [...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-rose-200/30 to-amber-200/30"
                        style={{
                            width: 4 + Math.random() * 6,
                            height: 4 + Math.random() * 6,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}

                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-amber-200/20 to-orange-200/20 blur-3xl"
                    style={{ x: smoothX, y: smoothY }}
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/50"
            >
                <div className="px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <Lightbulb size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-serif text-xl bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent font-bold">
                                Ideas for Us
                            </h1>
                            <p className="text-slate-400 text-xs">Spark connection, create memories</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex px-4 pb-3 gap-2 overflow-x-auto no-scrollbar">
                    {[
                        { key: "ideas", label: "Date Ideas", icon: Lightbulb },
                        { key: "questions", label: "Questions", icon: MessageCircle },
                        { key: "challenges", label: "Challenges", icon: Trophy },
                        { key: "ai", label: "AI Suggest", icon: Wand2 },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                activeTab === tab.key
                                    ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-200/50"
                                    : "bg-white/60 text-slate-500 hover:bg-white"
                            )}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </motion.header>

            <div className="px-5 pt-5">
                <AnimatePresence mode="wait">
                    {/* DATE IDEAS TAB */}
                    {activeTab === "ideas" && (
                        <motion.div
                            key="ideas"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* Categories */}
                            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setCategory(cat.key as keyof typeof DATE_IDEAS)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                                            category === cat.key
                                                ? "bg-white shadow-lg text-slate-800"
                                                : "bg-white/50 text-slate-500"
                                        )}
                                    >
                                        <span>{cat.emoji}</span>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Main Idea Card */}
                            {currentIdea && (
                                <motion.div
                                    key={currentIdea.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative"
                                >
                                    <div className={`absolute -inset-3 bg-gradient-to-r ${currentIdea.color} opacity-15 blur-2xl rounded-3xl`} />

                                    <div className="relative bg-white rounded-3xl p-6 shadow-xl">
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-t-3xl" />

                                        <div className="flex justify-between items-start mb-4">
                                            <motion.div
                                                className="text-5xl"
                                                animate={{ scale: isShuffling ? [1, 1.2, 1] : 1 }}
                                            >
                                                {currentIdea.emoji}
                                            </motion.div>
                                            <button
                                                onClick={() => saveIdea(currentIdea.title)}
                                                className={cn(
                                                    "p-2 rounded-full transition-all",
                                                    savedIdeas.includes(currentIdea.title)
                                                        ? "bg-rose-100 text-rose-500"
                                                        : "bg-slate-50 text-slate-400 hover:bg-rose-50"
                                                )}
                                            >
                                                <BookmarkPlus size={18} />
                                            </button>
                                        </div>

                                        <h2 className="font-serif text-xl text-slate-800 font-bold mb-2">
                                            {currentIdea.title}
                                        </h2>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {currentIdea.description}
                                        </p>

                                        <div className="mt-6 flex items-center justify-between">
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Heart size={12} className="text-rose-300" />
                                                for {partner?.nickname || "you two"}
                                            </span>
                                            <button
                                                onClick={getRandomIdea}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-medium rounded-full"
                                            >
                                                <RefreshCw size={14} className={cn(isShuffling && "animate-spin")} />
                                                Next Idea
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* QUESTIONS TAB */}
                    {activeTab === "questions" && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <MessageCircle size={60} className="text-white/10" />
                                </div>

                                <p className="text-violet-100 text-sm mb-4">Question {currentQuestion + 1} of {COUPLE_QUESTIONS.length}</p>

                                <motion.h2
                                    key={currentQuestion}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="font-serif text-2xl leading-relaxed mb-8"
                                >
                                    "{COUPLE_QUESTIONS[currentQuestion]}"
                                </motion.h2>

                                <button
                                    onClick={nextQuestion}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all"
                                >
                                    Next Question
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            <p className="text-center text-xs text-slate-400 mt-6">
                                Ask each other these questions. Listen with curiosity. 💕
                            </p>
                        </motion.div>
                    )}

                    {/* CHALLENGES TAB */}
                    {activeTab === "challenges" && (
                        <motion.div
                            key="challenges"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Flame size={20} className="text-orange-500" />
                                <h2 className="font-serif text-lg text-slate-800">Couple Challenges</h2>
                            </div>

                            {COUPLE_CHALLENGES.map((challenge, idx) => (
                                <motion.div
                                    key={challenge.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
                                >
                                    <div className="text-3xl">{challenge.emoji}</div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-800">{challenge.title}</h3>
                                        <p className="text-xs text-slate-500">{challenge.description}</p>
                                    </div>
                                    <span className={cn(
                                        "text-xs px-2 py-1 rounded-full font-medium",
                                        challenge.difficulty === "Easy" && "bg-green-100 text-green-600",
                                        challenge.difficulty === "Medium" && "bg-amber-100 text-amber-600",
                                        challenge.difficulty === "Hard" && "bg-red-100 text-red-600",
                                        challenge.difficulty === "Fun" && "bg-violet-100 text-violet-600"
                                    )}>
                                        {challenge.difficulty}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* AI SUGGESTIONS TAB */}
                    {activeTab === "ai" && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-6 text-white mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Wand2 size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold">AI Date Planner</h2>
                                        <p className="text-sm text-white/70">Get personalized suggestions</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && getAiSuggestion()}
                                        placeholder="Describe what you're looking for..."
                                        className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/50 outline-none focus:ring-2 ring-white/30"
                                    />
                                    <button
                                        onClick={getAiSuggestion}
                                        disabled={isAiLoading || !aiPrompt.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-lg disabled:opacity-50"
                                    >
                                        {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </div>

                                {/* Quick suggestions */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {quickSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => { setAiPrompt(suggestion); }}
                                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-all"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AI Response */}
                            {aiResponse && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-5 shadow-lg"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={16} className="text-violet-500" />
                                        <span className="font-medium text-sm text-slate-800">AI Suggestion</span>
                                    </div>
                                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {aiResponse}
                                    </div>
                                </motion.div>
                            )}

                            {!aiResponse && !isAiLoading && (
                                <div className="text-center py-12">
                                    <Wand2 size={40} className="text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 text-sm">
                                        Ask me anything about date ideas!
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
