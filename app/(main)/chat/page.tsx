"use client"

import { useEffect, useRef, useState } from "react"
import { useUserStore } from "@/store/userStore"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Heart, Smile, Mic, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatPage() {
    const { getMessages, sendMessage, messages, user, partner, subscribeToRealtime } = useUserStore()
    const [inputText, setInputText] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Subscribe & Fetch
    useEffect(() => {
        getMessages()
        const unsubscribe = subscribeToRealtime()
        return () => { if (unsubscribe) unsubscribe() }
    }, [])

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = async () => {
        if (!inputText.trim()) return
        const text = inputText
        setInputText("") // Optimistic clear
        await sendMessage(text, "text")
    }

    const handleTouchMessage = async (type: "heart" | "kiss" | "hug") => {
        // Advanced feature: Send a non-text "touch"
        await sendMessage(type, "touch")
    }

    // Render Message Content based on type
    const renderMessage = (msg: any) => {
        if (msg.type === "touch") {
            // Special render for touch messages
            let emoji = "❤️"
            if (msg.content === "disagree") emoji = "😠" // Example
            if (msg.content === "hug") emoji = "🤗"
            if (msg.content === "kiss") emoji = "💋"

            return (
                <div className="text-4xl animate-bounce">
                    {emoji}
                </div>
            )
        }
        return <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
    }

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] pt-4 max-w-lg mx-auto overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white/50 backdrop-blur-md border-b border-white/20 z-10 mx-4 rounded-2xl shadow-sm mb-4">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white">
                        {partner?.avatar_url ? <img src={partner.avatar_url} className="w-full h-full object-cover" /> : null}
                    </div>
                    {/* Online Indicator (Fake for now) */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="ml-3">
                    <h2 className="font-bold text-slate-800 text-sm">{partner?.nickname || "Partner"}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                        Connected
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4 no-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-60">
                        <Smile size={48} className="mb-2" />
                        <p>Say hi to {partner?.nickname || "them"}!</p>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === user?.id
                    const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id)

                    return (
                        <motion.div
                            key={msg.id || idx}
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                                "flex w-full",
                                isMe ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn("flex max-w-[75%]", isMe ? "flex-row-reverse" : "flex-row")}>
                                {/* Avatar for partner */}
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shrink-0 mr-2 self-end">
                                        {partner?.avatar_url && showAvatar ? (
                                            <img src={partner.avatar_url} className="w-full h-full object-cover" />
                                        ) : !showAvatar ? <div className="w-full h-full" /> : null}
                                    </div>
                                )}

                                <div className={cn(
                                    "p-3 rounded-2xl relative shadow-sm",
                                    isMe ? "bg-rose-400 text-white rounded-br-none" : "bg-white text-slate-700 rounded-bl-none border border-slate-100",
                                    msg.type === 'touch' && "bg-transparent shadow-none border-none p-0"
                                )}>
                                    {renderMessage(msg)}

                                    {/* Timestamp */}
                                    <span className={cn(
                                        "text-[9px] block mt-1 opacity-70 text-right",
                                        isMe ? "text-rose-100" : "text-slate-400"
                                    )}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/60 backdrop-blur-md pb-24 border-t border-white/20">
                <div className="flex items-center gap-2 mb-3">
                    {/* Action Bar */}
                    <button onClick={() => handleTouchMessage("hug")} className="p-2 rounded-full bg-rose-50 text-rose-400 hover:bg-rose-100 transition-colors">
                        🤗
                    </button>
                    <button onClick={() => handleTouchMessage("kiss")} className="p-2 rounded-full bg-rose-50 text-rose-400 hover:bg-rose-100 transition-colors">
                        💋
                    </button>
                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                    <button className="text-slate-400 hover:text-slate-600">
                        <ImageIcon size={20} />
                    </button>
                    <button className="text-slate-400 hover:text-slate-600">
                        <Mic size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 pr-1 pl-4 rounded-full shadow-lg border border-slate-100 focus-within:ring-2 ring-rose-200 transition-all">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 min-h-[44px]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="w-10 h-10 rounded-full bg-rose-400 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-400 flex items-center justify-center text-white transition-all shadow-md active:scale-95"
                    >
                        <Send size={18} className={cn(inputText.trim() && "mr-0.5 mt-0.5")} />
                    </button>
                </div>
            </div>
        </div>
    )
}
