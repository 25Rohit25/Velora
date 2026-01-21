"use client"

import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home')
    }
  }, [isAuthenticated, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative z-10">
      <OnboardingFlow />
    </main>
  );
}
