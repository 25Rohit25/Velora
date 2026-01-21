"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MapPin, Calendar, Clock } from "lucide-react"

const ideas = [
    {
        title: "Stargazing Picnic",
        category: "Romantic",
        location: "Backyard or Park",
        duration: "2h",
        color: "bg-indigo-100 text-indigo-800"
    },
    {
        title: "Pottery Workshop",
        category: "Creative",
        location: "Downtown Studio",
        duration: "3h",
        color: "bg-orange-100 text-orange-800"
    },
    {
        title: "Indoor Fort Movie Night",
        category: "Cozy",
        location: "Living Room",
        duration: "All Night",
        color: "bg-rose-100 text-rose-800"
    }
]

export default function IdeasPage() {
    return (
        <div className="min-h-screen p-6 pt-12 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Sparks</h1>
                <p className="text-slate-500">Curated dates just for you.</p>
            </header>

            <div className="space-y-4">
                {ideas.map((idea, index) => (
                    <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${idea.color}`}>
                            {idea.category}
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-2">{idea.title}</h3>

                        <div className="flex items-center space-x-4 text-slate-400 text-sm mb-6">
                            <div className="flex items-center"><MapPin size={14} className="mr-1" /> {idea.location}</div>
                            <div className="flex items-center"><Clock size={14} className="mr-1" /> {idea.duration}</div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">Plan this Date</Button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
