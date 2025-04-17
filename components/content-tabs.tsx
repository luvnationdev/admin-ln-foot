"use client"
import { cn } from "@/lib/utils"

interface ContentTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function ContentTabs({ activeTab, onTabChange }: ContentTabsProps) {
  const tabs = [
    { id: "actualites", label: "ACTUALITES" },
    { id: "publicites", label: "PUBLICITES" },
    { id: "points-forts", label: "POINTS FORTS" },
  ]

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-8 py-4 font-semibold text-sm transition-colors",
            activeTab === tab.id ? "bg-blue-700 text-white" : "bg-white text-gray-800 hover:bg-gray-100",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
