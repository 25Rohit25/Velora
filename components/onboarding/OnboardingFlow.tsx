"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Shield, Sparkles, ArrowRight, Mail, Lock, Link as LinkIcon, Copy, Check } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { useRouter } from "next/navigation"

export default function OnboardingFlow() {
    const router = useRouter()
    // authState: 0=Welcome, 1=Auth, 2=Profile, 3=Pairing, 4=Success
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [pairingCode, setPairingCode] = useState("")
    const [generatedCode, setGeneratedCode] = useState("")
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [loginError, setLoginError] = useState("")
    const [pairingMode, setPairingMode] = useState<'enter' | 'generate' | null>(null)
    const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')

    // Real User Store
    const { signUp, signIn, updateProfile, generatePairingCode, linkByPairingCode } = useUserStore()

    const handleAuth = async () => {
        setIsLoginLoading(true)
        setLoginError("")

        if (authMode === 'signup') {
            const { data, error } = await signUp(email, password)
            if (error) {
                setLoginError(error.message)
            } else {
                if (!data.session) {
                    setLoginError("Please check your email to confirm your account.")
                } else {
                    setStep(2)
                }
            }
        } else {
            const { data, error } = await signIn(email, password)
            if (error) {
                setLoginError(error.message)
            } else {
                setStep(2)
            }
        }
        setIsLoginLoading(false)
    }

    const handleProfileSave = async () => {
        setIsLoginLoading(true)
        await updateProfile({ nickname: name })
        setIsLoginLoading(false)
        setStep(3)
    }

    const [error, setError] = useState("")

    const generateCode = async () => {
        setPairingMode('generate')
        const { code, error } = await generatePairingCode()
        if (code) setGeneratedCode(code)
        if (error) setError("Could not generate code")
    }

    const handlePairingEnter = async () => {
        if (pairingCode.length < 5) return

        const { success, error } = await linkByPairingCode(pairingCode)
        if (success) {
            setStep(4)
        } else {
            setError(error.message || "Invalid Code")
        }
    }

    const handlePairingComplete = () => {
        setStep(4)
    }

    // Animation variants
    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto p-6 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={1}>

                {/* STEP 0: WELCOME */}
                {step === 0 && (
                    <motion.div
                        key="step0"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col items-center text-center space-y-8"
                    >
                        <motion.div
                            className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center text-soft-pink mb-4"
                            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Heart size={40} className="fill-current" />
                        </motion.div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Velora</h1>
                            <p className="text-xl text-slate-500 font-light leading-relaxed">
                                A private sanctuary<br />for just the two of you.
                            </p>
                        </div>

                        <Button size="lg" className="w-full max-w-xs mt-8" onClick={() => setStep(1)}>
                            Get Started
                        </Button>
                    </motion.div>
                )}

                {/* STEP 1: AUTHENTICATION */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col items-center text-center space-y-6 w-full"
                    >
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mb-2">
                            <Lock size={24} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-slate-700">Secure Access</h2>
                            <p className="text-slate-500 text-sm">Create an account or log in.</p>
                        </div>

                        {/* Auth Toggles */}
                        <div className="flex p-1 bg-slate-100 rounded-lg w-full">
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMode === 'signup' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setAuthMode('signup')}
                            >
                                Sign Up (New)
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMode === 'login' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setAuthMode('login')}
                            >
                                Login
                            </button>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <Input
                                    placeholder="Enter your email"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <Input
                                    type="password"
                                    placeholder={authMode === 'signup' ? "Create a password" : "Enter your password"}
                                    className="pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {loginError && <p className="text-xs text-red-500 font-medium px-1">{loginError}</p>}
                            <Button
                                onClick={handleAuth}
                                className="w-full"
                                disabled={!email || !password || isLoginLoading}
                            >
                                {isLoginLoading ? "Processing..." : (authMode === 'signup' ? "Create Account" : "Sign In")}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400">By continuing, you agree to our Terms & Privacy Policy.</p>
                    </motion.div>
                )}

                {/* STEP 2: PROFILE */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col items-center text-center space-y-6 w-full"
                    >
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-2">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-700">Who are you?</h2>

                        <div className="w-full space-y-4 text-left">
                            <div>
                                <label className="text-sm text-slate-500 ml-2">Your Nickname</label>
                                <Input
                                    placeholder="e.g. Honey, Alex"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full mt-4"
                            onClick={handleProfileSave}
                            disabled={!name}
                        >
                            Continue
                        </Button>
                    </motion.div>
                )}

                {/* STEP 3: PAIRING */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col items-center text-center space-y-6 w-full"
                    >
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
                            <LinkIcon size={24} />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-700">Connect Partner</h2>

                        {!pairingMode ? (
                            <div className="grid grid-cols-1 gap-4 w-full">
                                <button
                                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-rose-300 hover:bg-rose-50 transition-all flex flex-col items-center gap-2"
                                    onClick={generateCode}
                                >
                                    <span className="text-lg font-medium text-slate-700">I need a code</span>
                                    <span className="text-xs text-slate-400">To invite my partner</span>
                                </button>
                                <button
                                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col items-center gap-2"
                                    onClick={() => setPairingMode('enter')}
                                >
                                    <span className="text-lg font-medium text-slate-700">I have a code</span>
                                    <span className="text-xs text-slate-400">My partner sent me one</span>
                                </button>
                            </div>
                        ) : pairingMode === 'generate' ? (
                            <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                                <p className="text-sm text-slate-500 mb-4">Share this code with your partner:</p>
                                <div className="text-3xl font-mono font-bold text-slate-800 tracking-widest mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
                                    {generatedCode || "..."}
                                </div>
                                <Button variant="outline" className="w-full gap-2" onClick={() => navigator.clipboard.writeText(generatedCode)}>
                                    <Copy size={16} /> Copy Code
                                </Button>
                                <p className="text-xs text-slate-400 mt-4">Once they enter it, you'll be connected automatically.</p>
                                <Button variant="ghost" className="mt-2 text-xs" onClick={() => window.location.reload()}>
                                    Refresh Status
                                </Button>
                                <p className="text-xs text-slate-400 mt-4">Waiting for partner...</p>
                                <Button variant="ghost" className="mt-2 text-xs" onClick={handlePairingComplete}>
                                    Simulate Partner Joined (Dev)
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full space-y-4 animate-in fade-in zoom-in duration-300">
                                <Input
                                    placeholder="Enter Code (e.g. LOVE-1234)"
                                    className="text-center uppercase tracking-widest font-mono text-lg h-12"
                                    value={pairingCode}
                                    onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                                    maxLength={9}
                                />
                                {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                                <Button
                                    className="w-full"
                                    disabled={pairingCode.length < 5}
                                    onClick={handlePairingEnter}
                                >
                                    Connect
                                </Button>
                                <Button variant="ghost" onClick={() => setPairingMode(null)}>Cancel</Button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-2">
                            <Check size={40} />
                        </div>
                        <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-bold text-slate-800">Connected!</h2>
                            <p className="text-slate-500">You are now linked with your partner.</p>
                        </div>

                        <Button size="lg" className="w-64 bg-slate-900 text-white hover:bg-slate-800" onClick={() => router.push('/home')}>
                            Enter Velora <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="absolute bottom-4 flex space-x-2">
                {[0, 1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`transition-all duration-300 ${s === step ? 'w-4 bg-slate-800' : 'w-2 bg-slate-200'
                            } h-2 rounded-full`}
                    />
                ))}
            </div>
        </div >
    )
}
