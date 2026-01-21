"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/userStore"
import { PenLine, Check, X, RotateCw } from "lucide-react"

const COLORS = [
    { name: "yellow", bg: "bg-[#fff7d1]", text: "text-amber-900" },
    { name: "pink", bg: "bg-[#ffe4e1]", text: "text-rose-900" },
    { name: "blue", bg: "bg-[#e0f7fa]", text: "text-cyan-900" },
]

export default function StickyNote() {
    const { stickyNote, updateStickyNote, profile } = useUserStore()
    const [isEditing, setIsEditing] = useState(false)
    const [noteContent, setNoteContent] = useState("")
    const [selectedColor, setSelectedColor] = useState(0)

    // Sync with remote state on load/update
    useEffect(() => {
        if (stickyNote) {
            setNoteContent(stickyNote.content || "")
            const colorIndex = COLORS.findIndex(c => c.name === stickyNote.color)
            if (colorIndex !== -1) setSelectedColor(colorIndex)
        }
    }, [stickyNote])

    const handleSave = () => {
        setIsEditing(false)
        updateStickyNote({
            content: noteContent,
            color: COLORS[selectedColor].name,
            author_id: profile?.id,
            updated_at: new Date().toISOString()
        })
    }

    const currentColor = COLORS[selectedColor]

    return (
        <div className="relative py-4 perspective-1000 group">
            {/* The Note */}
            <motion.div
                layout
                className={cn(
                    "relative w-full aspect-[4/3] max-w-[280px] mx-auto shadow-xl transition-colors duration-500",
                    currentColor.bg,
                    isEditing ? "rotate-0 scale-100 z-50" : "rotate-1 hover:rotate-0 hover:scale-[1.02] cursor-pointer"
                )}
                // Realistic paper effect
                style={{
                    boxShadow: "2px 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)",
                    borderRadius: "2px 2px 2px 24px" // Folded corner
                }}
                onClick={() => !isEditing && setIsEditing(true)}
            >
                {/* Folded Corner Visual */}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-black/5 rounded-bl-3xl pointer-events-none"
                    style={{
                        borderTop: `24px solid transparent`,
                        borderRight: `24px solid rgba(0,0,0,0.05)`,
                        transform: "rotate(180deg)"
                    }}
                />

                {/* Content */}
                <div className="h-full p-6 flex flex-col relative">
                    {isEditing ? (
                        <>
                            <textarea
                                autoFocus
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                className={cn(
                                    "w-full h-full bg-transparent resize-none outline-none font-handwriting text-xl leading-relaxed",
                                    currentColor.text
                                )}
                                placeholder="Leave a note for them..."
                            />

                            {/* Edit Controls */}
                            <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-between px-2">
                                <div className="flex gap-2">
                                    {COLORS.map((c, i) => (
                                        <button
                                            key={c.name}
                                            onClick={(e) => { e.stopPropagation(); setSelectedColor(i); }}
                                            className={cn(
                                                "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                                                c.bg,
                                                i === selectedColor ? "border-slate-600 scale-110" : "border-white/50"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
                                        className="p-2 bg-white rounded-full text-slate-400 shadow-sm hover:text-slate-600"
                                    >
                                        <X size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSave(); }}
                                        className="p-2 bg-slate-800 rounded-full text-white shadow-sm hover:bg-slate-700"
                                    >
                                        <Check size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col">
                            {noteContent ? (
                                <p className={cn("font-handwriting text-xl leading-relaxed flex-1 whitespace-pre-wrap", currentColor.text)}>
                                    {noteContent}
                                </p>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-black/20 gap-2">
                                    <PenLine size={32} />
                                    <span className="font-handwriting text-lg">Tap to write a note...</span>
                                </div>
                            )}

                            {/* Footer Info */}
                            {noteContent && stickyNote?.updated_at && (
                                <p className="text-[10px] text-black/30 font-sans mt-2 text-right">
                                    {new Date(stickyNote.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Pin visual */}
                {!isEditing && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-300 shadow-sm border border-slate-400 z-10" />
                )}
            </motion.div>
        </div>
    )
}
