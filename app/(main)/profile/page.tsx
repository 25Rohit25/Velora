"use client"

import { useUserStore } from "@/store/userStore"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, LogOut, User, Bell, Shield, HelpCircle, ChevronRight, Camera, Key, X, Check, Edit2, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
    const { user, profile, partner, signOut, updateProfile, checkSession } = useUserStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Edit states
    const [showNameModal, setShowNameModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showAvatarModal, setShowAvatarModal] = useState(false)

    // Avatar upload
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

    const handleLogout = async () => {
        setIsLoading(true)
        await signOut()
        router.replace('/')
    }

    // Handle avatar file selection
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            setShowAvatarModal(true)
        }
    }

    // Upload avatar
    const handleAvatarUpload = async () => {
        if (!selectedAvatarFile || !user?.id) return

        setIsUploadingAvatar(true)
        try {
            const fileName = `avatars/${user.id}/${Date.now()}.${selectedAvatarFile.name.split('.').pop()}`

            const { error: uploadError } = await supabase.storage
                .from('memories')
                .upload(fileName, selectedAvatarFile)

            if (uploadError) throw uploadError

            const { data: urlData } = supabase.storage
                .from('memories')
                .getPublicUrl(fileName)

            await updateProfile({ avatar_url: urlData.publicUrl })
            await checkSession()

            setShowAvatarModal(false)
            setAvatarPreview(null)
            setSelectedAvatarFile(null)
        } catch (error: any) {
            alert("Upload failed: " + error?.message)
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const SettingsItem = ({ icon: Icon, label, value, onClick, isDestructive = false }: any) => (
        <button
            className={`w-full flex items-center justify-between p-4 hover:bg-white/40 transition-all active:scale-[0.98] ${isDestructive ? 'text-red-500' : 'text-slate-700'}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-red-50' : 'bg-gradient-to-br from-rose-50 to-violet-50 text-rose-500'}`}>
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
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between px-2"
                >
                    <h1 className="text-3xl font-serif bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent font-bold">Profile</h1>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center space-y-4 py-6"
                >
                    {/* Avatar */}
                    <div className="relative group">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarSelect}
                        />
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="w-32 h-32 rounded-full bg-gradient-to-tr from-rose-300 to-violet-300 p-[3px] shadow-xl shadow-rose-100/50"
                        >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-bold text-slate-200">
                                        {(profile?.nickname || user?.email || "?")[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 p-2.5 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full text-white shadow-lg border-3 border-white hover:shadow-xl transition-shadow"
                        >
                            <Camera size={16} />
                        </motion.button>
                    </div>

                    {/* Name & Email */}
                    <div className="text-center space-y-1">
                        <button
                            onClick={() => setShowNameModal(true)}
                            className="flex items-center gap-2 group"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                                {profile?.nickname || "Set your name"}
                            </h2>
                            <Edit2 size={14} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
                        </button>
                        <p className="text-sm text-slate-400">{user?.email}</p>
                    </div>

                    {/* Partner Badge */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-sm rounded-full text-rose-600 text-sm font-semibold shadow-sm border border-rose-100"
                    >
                        <HeartIcon className="fill-rose-500" />
                        <span>{partner ? `With: ${partner.nickname || "Partner"}` : "Not Paired Yet"}</span>
                    </motion.div>
                </motion.div>

                {/* Account Settings */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                >
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Account</h3>
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 shadow-sm">
                        <SettingsItem
                            icon={User}
                            label="Edit Name"
                            value={profile?.nickname || "Not set"}
                            onClick={() => setShowNameModal(true)}
                        />
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <SettingsItem
                            icon={Key}
                            label="Change Password"
                            onClick={() => setShowPasswordModal(true)}
                        />
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <SettingsItem
                            icon={Camera}
                            label="Change Avatar"
                            onClick={() => fileInputRef.current?.click()}
                        />
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
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 shadow-sm">
                        <SettingsItem icon={Bell} label="Notifications" value="On" onClick={() => { }} />
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <SettingsItem icon={Shield} label="Privacy Policy" onClick={() => { }} />
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <SettingsItem icon={HelpCircle} label="Help Center" onClick={() => { }} />
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <SettingsItem
                            icon={LogOut}
                            label={isLoading ? "Logging Out..." : "Log Out"}
                            isDestructive
                            onClick={handleLogout}
                        />
                    </div>
                </motion.div>

                <div className="text-center pt-4 pb-8">
                    <p className="text-xs text-slate-300">Velora v1.0.0</p>
                </div>
            </div>

            {/* Edit Name Modal */}
            <AnimatePresence>
                {showNameModal && (
                    <EditNameModal
                        currentName={profile?.nickname || ""}
                        onClose={() => setShowNameModal(false)}
                        onSave={async (name) => {
                            await updateProfile({ nickname: name })
                            await checkSession()
                            setShowNameModal(false)
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Change Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
                )}
            </AnimatePresence>

            {/* Avatar Preview Modal */}
            <AnimatePresence>
                {showAvatarModal && avatarPreview && (
                    <AvatarPreviewModal
                        previewUrl={avatarPreview}
                        isUploading={isUploadingAvatar}
                        onClose={() => {
                            setShowAvatarModal(false)
                            setAvatarPreview(null)
                            setSelectedAvatarFile(null)
                        }}
                        onConfirm={handleAvatarUpload}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// Edit Name Modal
function EditNameModal({ currentName, onClose, onSave }: { currentName: string, onClose: () => void, onSave: (name: string) => Promise<void> }) {
    const [name, setName] = useState(currentName)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!name.trim()) return
        setIsSaving(true)
        await onSave(name.trim())
        setIsSaving(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl text-slate-800">Edit Name</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-rose-200 text-slate-700 text-lg"
                />

                <button
                    onClick={handleSave}
                    disabled={isSaving || !name.trim()}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                    {isSaving ? "Saving..." : "Save Name"}
                </button>
            </motion.div>
        </motion.div>
    )
}

// Change Password Modal
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")

    const handleChangePassword = async () => {
        setError("")

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match")
            return
        }

        setIsSaving(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            alert("Password updated successfully!")
            onClose()
        } catch (error: any) {
            setError(error?.message || "Failed to update password")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl text-slate-800">Change Password</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-rose-200 text-slate-700"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-rose-200 text-slate-700"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                </div>

                <button
                    onClick={handleChangePassword}
                    disabled={isSaving || !newPassword || !confirmPassword}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Key size={20} />}
                    {isSaving ? "Updating..." : "Update Password"}
                </button>
            </motion.div>
        </motion.div>
    )
}

// Avatar Preview Modal
function AvatarPreviewModal({ previewUrl, isUploading, onClose, onConfirm }: {
    previewUrl: string,
    isUploading: boolean,
    onClose: () => void,
    onConfirm: () => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl text-slate-800">New Avatar</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-rose-100 shadow-lg">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isUploading}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                        {isUploading ? "Uploading..." : "Save"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
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
