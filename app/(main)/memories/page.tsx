"use client"

import { motion } from "framer-motion"
import { Lock } from "lucide-react"

export default function MemoriesPage() {
    return (
        <div className="min-h-screen p-6 pt-12 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Memory Vault</h1>
                <p className="text-slate-500">Moments frozen in time.</p>
            </header>

            {/* Time Capsule */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="bg-white/50 p-2 rounded-full text-indigo-400"><Lock size={20} /></div>
                    <h3 className="font-semibold text-indigo-900">Time Capsule</h3>
                </div>
                <p className="text-indigo-800/60 text-sm mb-4">Opens on our Anniversary (Oct 14)</p>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-300 w-3/4"></div>
                </div>
            </section>

            {/* Gallery Grid */}
            <div className="columns-2 gap-4 space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`w-full rounded-2xl overflow-hidden bg-slate-200 break-inside-avoid ${i % 2 === 0 ? 'aspect-square' : 'aspect-[3/4]'}`}
                    >
                        {/* Placeholder for images */}
                        <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-300">
                            Image {i}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
