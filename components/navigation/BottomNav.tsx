"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, MessageCircleHeart, BookHeart, User, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/memories', icon: Camera, label: 'Moments' },
    { href: '/chat', icon: MessageCircleHeart, label: 'Chat' },
    { href: '/journal', icon: BookHeart, label: 'Diary' },
    { href: '/profile', icon: User, label: 'Me' },
]

export default function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <nav className="glass-card !rounded-full px-8 py-4 flex items-center space-x-8 pointer-events-auto shadow-2xl shadow-slate-200/50">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link key={item.href} href={item.href} className="relative group flex flex-col items-center">
                            {isActive && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute -top-3 w-1 h-1 bg-soft-pink rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div
                                className={cn(
                                    "p-2 rounded-full transition-all duration-300",
                                    isActive ? "text-slate-800" : "text-slate-400 group-hover:text-soft-pink"
                                )}
                            >
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn("transition-transform duration-300", isActive && "scale-110")}
                                />
                            </div>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
