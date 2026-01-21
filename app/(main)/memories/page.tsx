"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Plus, Heart, Sparkles, X, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useUserStore } from "@/store/userStore"
import { cn } from "@/lib/utils"
import AddMemoryModal from "@/components/memories/AddMemoryModal"

interface Memory {
    id: string
    image_url: string
    frame_type: string
    note: string | null
    moment_date: string | null
    created_at: string
    isDemo?: boolean
    x?: number
    y?: number
    rotation?: number
    zIndex?: number
}

// Demo memories with beautiful images
const generateDemoMemories = (): Memory[] => {
    const baseMemories = [
        { id: "demo-1", image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&h=300&fit=crop", note: "first date ☕" },
        { id: "demo-2", image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=300&fit=crop", note: "sunset walk 🌅" },
        { id: "demo-3", image_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=300&fit=crop", note: "cooking together" },
        { id: "demo-4", image_url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=300&fit=crop", note: "laughing 😂" },
        { id: "demo-5", image_url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&fit=crop", note: "movie night" },
        { id: "demo-6", image_url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=300&fit=crop", note: "just us 💕" },
        { id: "demo-7", image_url: "https://images.unsplash.com/photo-1501901609772-df0848060b33?w=300&h=300&fit=crop", note: "road trip!" },
        { id: "demo-8", image_url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&h=300&fit=crop", note: "dancing 💃" },
    ]

    return baseMemories.map((mem, idx) => ({
        ...mem,
        frame_type: "polaroid",
        moment_date: "2024-01-01",
        created_at: "2024-01-01",
        isDemo: true,
        x: 8 + (idx % 4) * 23 + (Math.random() * 6 - 3),
        y: 8 + Math.floor(idx / 4) * 35 + (Math.random() * 6 - 3),
        rotation: Math.random() * 20 - 10,
        zIndex: idx,
    }))
}

export default function MemoriesPage() {
    const { profile, user } = useUserStore()
    const [memories, setMemories] = useState<Memory[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
    const [showDemoNotice, setShowDemoNotice] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    // Mouse parallax effect
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

    const fetchMemories = async () => {
        if (!profile?.couple_id && !user?.id) {
            setMemories(generateDemoMemories())
            setLoading(false)
            return
        }

        let query = supabase.from('memories').select('*').order('moment_date', { ascending: false })
        if (profile?.couple_id) query = query.eq('couple_id', profile.couple_id)
        else if (user?.id) query = query.eq('added_by', user.id)

        const { data, error } = await query

        if (!error && data && data.length > 0) {
            const memoriesWithPositions = data.map((mem, idx) => ({
                ...mem,
                x: 8 + (idx % 4) * 23 + (Math.random() * 6 - 3),
                y: 8 + Math.floor(idx / 4) * 35 + (Math.random() * 6 - 3),
                rotation: Math.random() * 20 - 10,
                zIndex: idx,
            }))
            setMemories(memoriesWithPositions)
            setShowDemoNotice(false)
        } else {
            setMemories(generateDemoMemories())
        }
        setLoading(false)
    }

    useEffect(() => { fetchMemories() }, [profile?.couple_id, user?.id])

    const bringToFront = (id: string) => {
        setMemories(prev => {
            const maxZ = Math.max(...prev.map(m => m.zIndex || 0))
            return prev.map(m => m.id === id ? { ...m, zIndex: maxZ + 1 } : m)
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Heart size={40} className="text-rose-400" />
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-32 overflow-hidden relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50/80 to-violet-50" />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-rose-200/40"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.3, 0.7, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Glowing orbs */}
                <motion.div
                    className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-rose-200/30 to-pink-200/30 blur-3xl"
                    style={{ x: smoothX, y: smoothY }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-gradient-to-r from-violet-200/30 to-sky-200/30 blur-3xl"
                    animate={{ scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 px-5 py-4 flex items-center justify-between border-b border-white/50 shadow-sm"
            >
                <div>
                    <h1 className="font-serif text-2xl bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent font-bold">
                        Memory Wall
                    </h1>
                    <p className="text-slate-400 text-xs mt-0.5">Tap to view • Drag to arrange</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-200/50 flex items-center justify-center"
                >
                    <Plus size={24} />
                </motion.button>
            </motion.header>

            {/* Demo Notice */}
            {showDemoNotice && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-4 mt-4 p-3 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center gap-3 shadow-sm border border-white/50"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-100 to-violet-100 flex items-center justify-center">
                        <Sparkles size={16} className="text-rose-500" />
                    </div>
                    <p className="text-xs text-slate-600">
                        <span className="font-semibold">Example wall</span> — Add your own photos!
                    </p>
                </motion.div>
            )}

            {/* Scattered Polaroid Wall */}
            <div ref={containerRef} className="relative w-full min-h-[800px] mt-4 px-2">
                {memories.map((memory, idx) => (
                    <motion.div
                        key={memory.id}
                        className="absolute cursor-grab active:cursor-grabbing"
                        style={{
                            left: `${memory.x}%`,
                            top: `${memory.y}%`,
                            zIndex: memory.zIndex || 0,
                        }}
                        initial={{ opacity: 0, scale: 0, rotate: memory.rotation! - 20 }}
                        animate={{ opacity: 1, scale: 1, rotate: memory.rotation }}
                        transition={{
                            delay: idx * 0.08,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                        }}
                        drag
                        dragMomentum={false}
                        onDragStart={() => bringToFront(memory.id)}
                        onClick={() => {
                            setSelectedMemory(memory)
                            bringToFront(memory.id)
                        }}
                    >
                        <PolaroidCard memory={memory} />
                    </motion.div>
                ))}
            </div>

            {/* Modals */}
            <AddMemoryModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={fetchMemories} />

            <AnimatePresence>
                {selectedMemory && (
                    <MemoryDetailModal
                        memory={selectedMemory}
                        onClose={() => setSelectedMemory(null)}
                        onDelete={(id) => setMemories(memories.filter(m => m.id !== id))}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// Polaroid Card
function PolaroidCard({ memory }: { memory: Memory }) {
    return (
        <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-200 to-violet-200 rounded-lg opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500" />

            <div className="relative bg-white shadow-xl" style={{ padding: '8px 8px 0 8px', width: '140px' }}>
                {/* Photo */}
                <div className="relative overflow-hidden">
                    <img
                        src={memory.image_url}
                        alt="Memory"
                        className="w-full h-[120px] object-cover"
                        draggable={false}
                    />
                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%', y: '-100%' }}
                        whileHover={{ x: '100%', y: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </div>

                {/* Note area */}
                <div className="h-[45px] flex items-center justify-center px-1">
                    <p className="font-handwriting text-xs text-slate-700 text-center leading-tight">
                        {memory.note || "..."}
                    </p>
                </div>
            </div>
        </div>
    )
}

// Memory Detail Modal
function MemoryDetailModal({ memory, onClose, onDelete }: { memory: Memory; onClose: () => void; onDelete?: (id: string) => void }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (memory.isDemo) return alert("Demo photos can't be deleted!")
        if (!confirm("Delete this memory?")) return

        setIsDeleting(true)
        try {
            const urlParts = memory.image_url.split('/memories/')
            if (urlParts[1]) await supabase.storage.from('memories').remove([decodeURIComponent(urlParts[1])])
            const { error } = await supabase.from('memories').delete().eq('id', memory.id)
            if (error) throw error
            onDelete?.(memory.id)
            onClose()
        } catch (e: any) {
            alert("Failed: " + e?.message)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute top-6 right-6 flex gap-3 z-10">
                {!memory.isDemo && (
                    <motion.button whileHover={{ scale: 1.1 }} onClick={handleDelete} disabled={isDeleting}
                        className="w-11 h-11 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white">
                        <Trash2 size={20} />
                    </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.1 }} onClick={onClose}
                    className="w-11 h-11 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white">
                    <X size={24} />
                </motion.button>
            </div>

            <motion.div
                initial={{ scale: 0.7, opacity: 0, rotateX: 20 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.7, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white shadow-2xl"
                style={{ padding: '14px 14px 0 14px', maxWidth: '360px' }}
            >
                <img src={memory.image_url} alt="Memory" className="w-full aspect-square object-cover" />
                <div className="min-h-[80px] flex items-center justify-center px-4 py-4">
                    <p className="font-handwriting text-2xl text-slate-700 text-center leading-relaxed">
                        {memory.note || "no note..."}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
