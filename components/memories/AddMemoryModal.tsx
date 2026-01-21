"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ImagePlus, Check, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/userStore"
import { supabase } from "@/lib/supabase"

const FRAMES = [
    { id: "polaroid", name: "Polaroid", preview: "📷", desc: "Classic with text" },
    { id: "tape", name: "Washi Tape", preview: "🎀", desc: "Colorful strips" },
    { id: "scrapbook", name: "Scrapbook", preview: "🌸", desc: "With stickers" },
    { id: "pastel", name: "Hearts", preview: "💕", desc: "Soft & cute" },
    { id: "film", name: "Film", preview: "🎬", desc: "Vintage look" },
    { id: "minimal", name: "Clean", preview: "⬜", desc: "Simple white" },
    { id: "none", name: "No Frame", preview: "🖼️", desc: "Just photo" },
]

interface AddMemoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function AddMemoryModal({ isOpen, onClose, onSuccess }: AddMemoryModalProps) {
    const { user, profile } = useUserStore()
    const [selectedFrame, setSelectedFrame] = useState("polaroid")
    const [note, setNote] = useState("")
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        console.log("Save clicked", { selectedFile: !!selectedFile, user, profile })

        if (!selectedFile) {
            alert("Please select a photo first.")
            return
        }

        if (!user?.id) {
            alert("You need to be logged in. Please refresh the page and log in again.")
            return
        }

        setIsUploading(true)

        // Use couple_id if available, otherwise use user.id for solo testing
        const folderId = profile?.couple_id || user.id

        try {
            // 1. Upload to Supabase Storage
            const fileName = `${folderId}/${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('memories')
                .upload(fileName, selectedFile)

            if (uploadError) {
                console.error("Upload error:", uploadError)
                if (uploadError.message.includes("bucket") || uploadError.message.includes("not found")) {
                    alert("Storage bucket 'memories' not found. Please create it in Supabase Dashboard → Storage → New Bucket → Name: 'memories' → Public: ON")
                } else {
                    alert("Upload failed: " + uploadError.message)
                }
                setIsUploading(false)
                return
            }

            // 2. Get Public URL
            const { data: urlData } = supabase.storage
                .from('memories')
                .getPublicUrl(fileName)

            // 3. Save to memories table (couple_id can be null for solo users)
            const { error: insertError } = await supabase
                .from('memories')
                .insert({
                    couple_id: profile?.couple_id || null,
                    added_by: user.id,
                    image_url: urlData.publicUrl,
                    frame_type: selectedFrame,
                    note: note || null,
                    moment_date: new Date().toISOString().split('T')[0]
                })

            if (insertError) {
                console.error("Database error:", insertError)
                alert("Photo uploaded but failed to save: " + insertError.message)
                setIsUploading(false)
                return
            }

            // Success
            onSuccess?.()
            onClose()
            resetForm()
        } catch (error: any) {
            console.error("Failed to save memory:", error)
            alert("Something went wrong: " + (error?.message || "Unknown error"))
        } finally {
            setIsUploading(false)
        }
    }

    const resetForm = () => {
        setSelectedFrame("polaroid")
        setNote("")
        setPreviewUrl(null)
        setSelectedFile(null)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <h2 className="font-serif text-xl text-slate-800">Add a Moment</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-5 pb-8 space-y-6">
                        {/* Photo Upload */}
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            {!previewUrl ? (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-rose-300 transition-colors flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-rose-400 bg-slate-50/50"
                                >
                                    <ImagePlus size={48} strokeWidth={1.5} />
                                    <span className="text-sm font-medium">Choose a Photo</span>
                                </button>
                            ) : (
                                <div className="relative">
                                    <FramedPhoto src={previewUrl} frameType={selectedFrame} />
                                    <button
                                        onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-md text-slate-500 hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Frame Selection */}
                        {previewUrl && (
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Choose a Frame</p>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {FRAMES.map((frame) => (
                                        <button
                                            key={frame.id}
                                            onClick={() => setSelectedFrame(frame.id)}
                                            className={cn(
                                                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all shrink-0",
                                                selectedFrame === frame.id
                                                    ? "border-rose-400 bg-rose-50 text-rose-600"
                                                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="text-xl">{frame.preview}</span>
                                            <span className="text-[10px] font-medium whitespace-nowrap">{frame.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Memory Note */}
                        {previewUrl && (
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <PenLine size={12} />
                                    What this moment meant
                                </p>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="A note to us..."
                                    className="w-full h-24 bg-slate-50 rounded-xl p-4 text-slate-700 placeholder:text-slate-300 border-none focus:ring-2 ring-rose-200 resize-none outline-none font-handwriting text-lg"
                                />
                            </div>
                        )}

                        {/* Save Button */}
                        {previewUrl && (
                            <button
                                onClick={handleSave}
                                disabled={isUploading || !selectedFile}
                                className="w-full py-4 bg-rose-400 hover:bg-rose-500 disabled:bg-slate-200 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Save this Moment
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// Framed Photo Component
function FramedPhoto({ src, frameType }: { src: string; frameType: string }) {
    const frameStyles: Record<string, string> = {
        none: "",
        polaroid: "p-3 pb-12 bg-white shadow-xl rotate-1",
        tape: "p-2 bg-amber-50/80 shadow-md -rotate-1",
        scrapbook: "p-4 bg-gradient-to-br from-rose-50 to-amber-50 shadow-lg rounded-sm",
        pastel: "p-3 bg-gradient-to-br from-rose-100 via-lavender-100 to-sky-100 rounded-2xl shadow-md",
        minimal: "p-1 bg-white shadow-sm rounded-lg",
    }

    return (
        <div className={cn("inline-block transition-all", frameStyles[frameType] || "")}>
            <img
                src={src}
                alt="Memory"
                className={cn(
                    "w-full aspect-square object-cover",
                    frameType === "polaroid" && "rounded-sm",
                    frameType === "tape" && "rounded-none",
                    frameType === "pastel" && "rounded-xl",
                    frameType === "minimal" && "rounded-md",
                    frameType === "none" && "rounded-2xl"
                )}
            />
            {/* Tape corners for "tape" frame */}
            {frameType === "tape" && (
                <>
                    <div className="absolute -top-2 left-4 w-8 h-4 bg-amber-200/80 rounded-sm rotate-12" />
                    <div className="absolute -top-2 right-4 w-8 h-4 bg-amber-200/80 rounded-sm -rotate-12" />
                </>
            )}
        </div>
    )
}

export { FramedPhoto }
