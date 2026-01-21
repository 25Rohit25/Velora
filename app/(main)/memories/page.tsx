"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
}

// Beautiful demo memories with varied rotations
const DEMO_MEMORIES: Memory[] = [
    {
        id: "demo-1",
        image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "Our first coffee date ☕",
        moment_date: "2024-02-14",
        created_at: "2024-02-14",
        isDemo: true
    },
    {
        id: "demo-2",
        image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "sunset walk 🌅",
        moment_date: "2024-03-20",
        created_at: "2024-03-20",
        isDemo: true
    },
    {
        id: "demo-3",
        image_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "cooking together",
        moment_date: "2024-04-10",
        created_at: "2024-04-10",
        isDemo: true
    },
    {
        id: "demo-4",
        image_url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "laughing at nothing 😂",
        moment_date: "2024-05-01",
        created_at: "2024-05-01",
        isDemo: true
    },
    {
        id: "demo-5",
        image_url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "movie night",
        moment_date: "2024-06-15",
        created_at: "2024-06-15",
        isDemo: true
    },
    {
        id: "demo-6",
        image_url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "just us 💕",
        moment_date: "2024-07-04",
        created_at: "2024-07-04",
        isDemo: true
    },
    {
        id: "demo-7",
        image_url: "https://images.unsplash.com/photo-1501901609772-df0848060b33?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "road trip!",
        moment_date: "2024-08-12",
        created_at: "2024-08-12",
        isDemo: true
    },
    {
        id: "demo-8",
        image_url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=400&fit=crop",
        frame_type: "polaroid",
        note: "dancing 💃",
        moment_date: "2024-09-01",
        created_at: "2024-09-01",
        isDemo: true
    },
]

// Random rotations for scattered effect
const ROTATIONS = [-12, 5, -8, 10, -5, 8, -10, 6, -4, 12]

export default function MemoriesPage() {
    const { profile, user } = useUserStore()
    const [memories, setMemories] = useState<Memory[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
    const [showDemoNotice, setShowDemoNotice] = useState(true)

    const fetchMemories = async () => {
        if (!profile?.couple_id && !user?.id) {
            setMemories(DEMO_MEMORIES)
            setLoading(false)
            return
        }

        // Fetch memories - either by couple_id OR by added_by (for solo users)
        let query = supabase
            .from('memories')
            .select('*')
            .order('moment_date', { ascending: false })

        if (profile?.couple_id) {
            query = query.eq('couple_id', profile.couple_id)
        } else if (user?.id) {
            query = query.eq('added_by', user.id)
        }

        const { data, error } = await query

        if (!error && data && data.length > 0) {
            setMemories(data)
            setShowDemoNotice(false)
        } else {
            setMemories(DEMO_MEMORIES)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMemories()
    }, [profile?.couple_id, user?.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Heart size={32} className="text-rose-300 animate-pulse" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-6 pb-32 px-4 bg-gradient-to-br from-amber-50/50 via-white to-rose-50/50">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl text-slate-800">Memory Wall</h1>
                    <p className="text-slate-500 text-sm mt-1">Our scattered moments ✨</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-12 h-12 rounded-full bg-rose-400 hover:bg-rose-500 text-white shadow-lg flex items-center justify-center transition-all active:scale-95"
                >
                    <Plus size={24} />
                </button>
            </header>

            {/* Demo Notice */}
            {showDemoNotice && memories.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center gap-3 shadow-sm"
                >
                    <Sparkles size={18} className="text-rose-400 shrink-0" />
                    <p className="text-xs text-slate-600">
                        <span className="font-medium">Example wall</span> — Add your own photos!
                    </p>
                </motion.div>
            )}

            {/* Scattered Polaroid Wall */}
            <div className="relative min-h-[600px]">
                {memories.map((memory, idx) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.08, type: "spring" }}
                        className="inline-block cursor-pointer"
                        style={{
                            transform: `rotate(${ROTATIONS[idx % ROTATIONS.length]}deg)`,
                        }}
                        whileHover={{ scale: 1.05, zIndex: 10, rotate: 0 }}
                        onClick={() => setSelectedMemory(memory)}
                    >
                        <PolaroidCard memory={memory} />
                    </motion.div>
                ))}
            </div>

            {/* Add Modal */}
            <AddMemoryModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchMemories}
            />

            {/* View Memory Modal */}
            <AnimatePresence>
                {selectedMemory && (
                    <MemoryDetailModal
                        memory={selectedMemory}
                        onClose={() => setSelectedMemory(null)}
                        onDelete={(id) => {
                            setMemories(memories.filter(m => m.id !== id))
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// Polaroid Card - Like real instant photos
function PolaroidCard({ memory }: { memory: Memory }) {
    return (
        <div className="bg-white p-2 pb-0 shadow-xl hover:shadow-2xl transition-shadow m-2 inline-block">
            {/* Photo */}
            <img
                src={memory.image_url}
                alt="Memory"
                className="w-36 h-36 object-cover"
            />

            {/* Handwritten note area - like real polaroid */}
            <div className="h-14 flex items-center justify-center px-1">
                {memory.note ? (
                    <p className="font-handwriting text-sm text-slate-700 text-center leading-tight">
                        {memory.note}
                    </p>
                ) : (
                    <p className="font-handwriting text-xs text-slate-300 italic">
                        write here...
                    </p>
                )}
            </div>
        </div>
    )
}

// FIXED Memory Detail Modal - Full screen with delete option
function MemoryDetailModal({ memory, onClose, onDelete }: { memory: Memory; onClose: () => void; onDelete?: (id: string) => void }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (memory.isDemo) {
            alert("Demo photos can't be deleted. Upload your own!")
            return
        }

        const confirmed = confirm("Delete this memory? This cannot be undone.")
        if (!confirmed) return

        setIsDeleting(true)

        try {
            // 1. Extract file path from URL to delete from storage
            const urlParts = memory.image_url.split('/memories/')
            if (urlParts[1]) {
                const filePath = decodeURIComponent(urlParts[1])
                await supabase.storage.from('memories').remove([filePath])
            }

            // 2. Delete from database
            const { error } = await supabase
                .from('memories')
                .delete()
                .eq('id', memory.id)

            if (error) throw error

            // 3. Callback to refresh list
            onDelete?.(memory.id)
            onClose()
        } catch (error: any) {
            console.error("Delete failed:", error)
            alert("Failed to delete: " + (error?.message || "Unknown error"))
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Top Buttons */}
            <div className="absolute top-6 right-6 flex gap-3 z-10">
                {/* Delete Button */}
                {!memory.isDemo && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-10 h-10 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <Trash2 size={20} />
                        )}
                    </button>
                )}
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-3 pb-0 shadow-2xl max-w-sm w-full"
            >
                {/* Large Photo */}
                <img
                    src={memory.image_url}
                    alt="Memory"
                    className="w-full aspect-square object-cover"
                />

                {/* Handwritten note area */}
                <div className="min-h-[80px] flex items-center justify-center px-4 py-4">
                    {memory.note ? (
                        <p className="font-handwriting text-2xl text-slate-700 text-center leading-relaxed">
                            {memory.note}
                        </p>
                    ) : (
                        <p className="font-handwriting text-lg text-slate-300 italic">
                            no note yet...
                        </p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}
