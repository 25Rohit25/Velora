"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2, Plus, GripVertical } from "lucide-react"

// Mock Data
const communityPosts = [
    {
        id: 1,
        names: "Stardust & Moonbeam",
        badge: "Most Thoughtful",
        badgeColor: "bg-purple-100 text-purple-600",
        avatarGradient: "from-indigo-400 to-purple-400",
        content: "Made my partner their favorite breakfast in bed today just because. Seeing their smile made my whole week. #littlethings #joy",
        likes: 24,
        comments: 5,
        theme: "purple"
    },
    {
        id: 2,
        names: "Ocean Whisper",
        badge: "Best Listener",
        badgeColor: "bg-blue-100 text-blue-600",
        avatarGradient: "from-cyan-400 to-teal-400",
        content: "Advice needed: How do you keep the spark alive when both of you are super busy with work? Looking for creative, low-pressure ideas.",
        likes: 18,
        comments: 12,
        theme: "blue"
    },
    {
        id: 3,
        names: "Sunny Disposition",
        badge: "Adventure Seeker",
        badgeColor: "bg-orange-100 text-orange-600",
        avatarGradient: "from-amber-200 to-orange-400",
        content: "Surprised my love with a handwritten letter hidden in their laptop bag. They found it during a stressful meeting and said it saved their day! 💌",
        likes: 42,
        comments: 8,
        theme: "orange"
    }
]

export default function CommunityPage() {
    return (
        <div className="min-h-screen p-6 pb-32">

            {/* Header */}
            <header className="flex justify-between items-center mb-8 pt-6">
                <div className="space-y-1">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center space-x-2"
                    >
                        {/* Back button logic could go here if deeper navigation is needed, keeping simple for now */}
                    </motion.div>
                    <h1 className="text-3xl font-serif text-slate-700">Couple Community</h1>
                    <p className="text-slate-500 font-medium text-sm">Share positive moments & advice anonymously.</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-card px-4 py-2 rounded-full flex items-center space-x-2 text-slate-600 hover:text-soft-pink transition-colors"
                >
                    <span className="text-xl">☁️</span>
                    <Plus size={18} />
                </motion.button>
            </header>

            {/* Feed */}
            <div className="space-y-6">
                {communityPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card p-6 rounded-[2rem] border-white/60 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300`}
                    >
                        {/* Card Background Gradient Decor */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${post.avatarGradient} opacity-5 rounded-full blur-2xl -mr-10 -mt-10`}></div>

                        {/* Top Row: User Info */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${post.avatarGradient} shadow-inner flex-shrink-0`}></div>
                                <div>
                                    <h3 className="font-serif font-medium text-slate-700 text-lg">{post.names}</h3>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${post.badgeColor}`}>
                                        {post.badge === "Most Thoughtful" && "💜"}
                                        {post.badge === "Best Listener" && "💙"}
                                        {post.names.includes("Sunny") && "☀️"}
                                        <span className="ml-1">{post.badge}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                            {post.content}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <div className="flex space-x-6">
                                <button className="flex items-center space-x-1.5 text-slate-400 hover:text-rose-400 transition-colors group/heart">
                                    <Heart size={20} className="group-hover/heart:fill-current transition-colors" />
                                    <span className="text-sm font-medium">{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1.5 text-slate-400 hover:text-blue-400 transition-colors">
                                    <MessageCircle size={20} />
                                    <span className="text-sm font-medium">{post.comments}</span>
                                </button>
                            </div>

                            <button className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                                <Share2 size={18} />
                                <span className="text-sm font-medium">Share</span>
                            </button>
                        </div>

                    </motion.div>
                ))}
            </div>

            {/* Floating Action Button (Optional, but good for UX) */}
            {/* <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-soft-pink to-rose-300 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200"
             >
                <Plus size={28} />
             </motion.button> */}

        </div>
    )
}
