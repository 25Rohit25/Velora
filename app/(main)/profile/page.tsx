"use client"

import { useUserStore } from "@/store/userStore"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Settings, LogOut, User, Bell, Shield, HelpCircle, ChevronRight, Camera, Key } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
    const { user, profile, partner, signOut } = useUserStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [newName, setNewName] = useState(profile?.nickname || "")

    const handleLogout = async () => {
        setIsLoading(true)
        await signOut()
        router.replace('/')
    }

    const SettingsItem = ({ icon: Icon, label, value, onClick, isDestructive = false }: any) => (
        <button
            className={`w-full flex items-center justify-between p-4 glass-card hover:bg-white/40 transition-all active:scale-[0.98] ${isDestructive ? 'text-red-500' : 'text-slate-700'}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-50' : 'bg-indigo-50/50 text-indigo-500'}`}>
                    <Icon size={18} />
                </div>
                <span className="font-medium text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                {value && <span className="text-xs font-medium bg-white/50 px-2 py-1 rounded-full">{value}</span>}
                <ChevronRight size={16} />
            </div>
        </button>
    )

    return (
        <div className="min-h-screen w-full pb-36 px-4 pt-8 overflow-y-auto">
            <div className="max-w-md mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Profile</h1>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-white/20">
                        <Settings size={24} />
                    </Button>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center space-y-4 py-4"
                >
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-200 to-indigo-200 p-[3px] shadow-xl shadow-rose-100/50">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-slate-300">
                                        {(profile?.nickname || user?.email || "?")[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 bg-slate-800 rounded-full text-white shadow-lg border-2 border-white hover:scale-110 transition-transform">
                            <Camera size={14} />
                        </button>
                    </div>

                    <div className="text-center space-y-1">
                        {editMode ? (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    className="bg-white/50 border-none rounded-lg px-3 py-1 text-center font-bold text-xl text-slate-800 w-32 focus:ring-2 ring-rose-300 outline-none"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onBlur={() => {
                                        // Auto save on blur logic would go here
                                        setEditMode(false)
                                    }}
                                />
                                <span className="text-xs text-slate-400">(Enter to save)</span>
                            </div>
                        ) : (
                            <h2
                                className="text-2xl font-bold text-slate-800 cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center gap-2"
                                onClick={() => {
                                    setNewName(profile?.nickname || "")
                                    setEditMode(true)
                                }}
                            >
                                {profile?.nickname || "User"}
                                <span className="text-xs text-slate-400 font-normal opacity-50"><Settings size={12} /></span>
                            </h2>
                        )}
                        <p className="text-sm text-slate-500 font-medium tracking-wide">{user?.email}</p>
                    </div>

                    {/* Partner Badge */}
                    <div className="flex items-center gap-2 px-5 py-2.5 glass-card !rounded-full text-rose-600 text-sm font-semibold shadow-sm">
                        <HeartIcon className="fill-rose-500 animate-pulse" />
                        <span>With: {partner ? (partner.nickname || "Partner") : "Not Paired"}</span>
                    </div>
                </motion.div>

                {/* Account Settings */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                >
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Settings</h3>
                    <div className="glass-card rounded-3xl overflow-hidden">
                        <SettingsItem icon={User} label="Personal Info" onClick={() => setEditMode(true)} />
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />
                        <SettingsItem icon={Key} label="Password & Security" onClick={() => alert("Security settings coming soon.")} />
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />
                        <SettingsItem icon={Bell} label="Notifications" value="On" onClick={() => alert("Notifications managed by system.")} />
                    </div>
                </motion.div>

                {/* App Settings */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Support</h3>
                    <div className="glass-card rounded-3xl overflow-hidden">
                        <SettingsItem icon={Shield} label="Privacy Policy" onClick={() => window.open('/privacy', '_blank')} />
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />
                        <SettingsItem icon={HelpCircle} label="Help Center" onClick={() => alert("Support Center")} />
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />
                        <SettingsItem
                            icon={LogOut}
                            label={isLoading ? "Logging Out..." : "Log Out"}
                            isDestructive
                            onClick={handleLogout}
                        />
                    </div>
                </motion.div>

                <div className="text-center pt-8">
                    <p className="text-xs text-slate-300">Velora v1.0.0</p>
                </div>
            </div>
        </div>
    )
}

function HeartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}
