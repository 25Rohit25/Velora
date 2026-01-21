
import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "ghost" | "outline"
    size?: "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {

        const variants = {
            primary: "bg-gradient-to-r from-soft-pink to-rose-300 text-white hover:opacity-90 shadow-lg shadow-rose-200/50 border border-white/20",
            secondary: "bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white border border-white/60 shadow-md shadow-slate-200/50",
            ghost: "bg-transparent text-slate-600 hover:bg-slate-50/50",
            outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-soft-pink hover:text-soft-pink"
        }

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-12 px-6 text-base",
            lg: "h-14 px-8 text-lg",
            icon: "h-10 w-10 p-2 flex items-center justify-center"
        }

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
