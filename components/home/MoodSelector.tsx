"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils" // Ensure this exists or use standard class string interpolation if not

const moods = [
    { emoji: "😶‍🌫️", label: "Overwhelmed", color: "from-slate-200 to-slate-300", shadow: "shadow-slate-300/50" },
    { emoji: "🌧️", label: "Low", color: "from-blue-200 to-blue-300", shadow: "shadow-blue-300/50" },
    { emoji: "😌", label: "Okay", color: "from-green-100 to-green-200", shadow: "shadow-green-200/50" },
    { emoji: "✨", label: "Good", color: "from-orange-100 to-orange-200", shadow: "shadow-orange-200/50" },
    { emoji: "🥰", label: "Loved", color: "from-rose-200 to-rose-300", shadow: "shadow-rose-300/50" },
]

export default function MoodSelector({ onMoodChange, currentMood }: { onMoodChange: (mood: any) => void, currentMood?: any }) {
    // Determine initial index based on passed currentMood object
    const getInitialIndex = () => {
        if (!currentMood) return 2
        return moods.findIndex(m => m.label === currentMood.label) !== -1
            ? moods.findIndex(m => m.label === currentMood.label)
            : 2
    }

    const [value, setValue] = useState(getInitialIndex())
    const [isDragging, setIsDragging] = useState(false)

    // Sync if external prop changes (e.g. initial load)
    useEffect(() => {
        setValue(getInitialIndex())
    }, [currentMood])

    const handleChange = (newVal: number) => {
        setValue(newVal)
        // Pass the full mood object back up
        onMoodChange(moods[newVal])
    }

    // ... rest of render ...
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm mx-auto relative group"
        >
            {/* Glow Effect */}
            <div className={cn(
                "absolute -inset-1 bg-gradient-to-r rounded-[2rem] blur-xl opacity-40 transition-all duration-700",
                moods[value].color
            )} />

            <div className="relative glass-card rounded-[1.5rem] p-8 overflow-hidden backdrop-blur-xl border border-white/60">
                <div className="flex flex-col items-center space-y-8">

                    {/* Header */}
                    <motion.h3
                        className="text-lg font-medium text-slate-600/90 tracking-wide"
                        layoutId="title"
                    >
                        How is your heart?
                    </motion.h3>

                    {/* Emoji Display */}
                    <div className="relative h-32 w-32 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={value}
                                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    rotate: 0,
                                    filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.1))"
                                }}
                                exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="text-8xl absolute"
                            >
                                {moods[value].emoji}
                            </motion.div>
                        </AnimatePresence>

                        {/* Background Aura */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className={cn(
                                "absolute inset-0 rounded-full blur-2xl -z-10 bg-gradient-to-br opacity-40",
                                moods[value].color
                            )}
                        />
                    </div>

                    {/* Label */}
                    <div className="h-8 overflow-hidden relative w-full flex justify-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={value}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-slate-600 font-semibold text-xl absolute"
                            >
                                {moods[value].label}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Custom Slider */}
                    <div className="w-full pt-4 px-2 relative">
                        <input
                            type="range"
                            min="0"
                            max="4"
                            step="1"
                            value={value}
                            onChange={(e) => handleChange(parseInt(e.target.value))}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseUp={() => setIsDragging(false)}
                            onTouchStart={() => setIsDragging(true)}
                            onTouchEnd={() => setIsDragging(false)}
                            className="w-full h-12 opacity-0 z-20 cursor-pointer absolute top-0 left-0"
                        />

                        {/* Visual Track */}
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                            <motion.div
                                className={cn("h-full absolute left-0 top-0 bg-gradient-to-r", moods[value].color)}
                                initial={false}
                                animate={{ width: `${(value / 4) * 100}%` }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        </div>

                        {/* Visual Thumbs / Ticks */}
                        <div className="absolute top-4 left-0 w-full flex justify-between px-[2px] pointer-events-none z-10">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    className={cn(
                                        "w-3 h-3 rounded-full transition-all duration-300 shadow-sm",
                                        i === value ? "bg-white scale-150 ring-2 ring-slate-200" : "bg-slate-300"
                                    )}
                                    animate={{
                                        scale: i === value ? 1.5 : 1,
                                        backgroundColor: i <= value ? "#fff" : "#cbd5e1" // slate-300
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
