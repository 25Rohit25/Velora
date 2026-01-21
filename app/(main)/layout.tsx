"use client"

import { useEffect } from "react"
import { useUserStore } from "@/store/userStore"
import BottomNav from "@/components/navigation/BottomNav"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { checkSession, user, isLoading } = useUserStore()

    // Check session on mount
    useEffect(() => {
        if (!user) {
            checkSession()
        }
    }, [])

    return (
        <div className="relative min-h-screen pb-24 z-10">
            {children}
            <BottomNav />
        </div>
    );
}
