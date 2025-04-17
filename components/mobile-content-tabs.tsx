"use client"
import { cn } from "@/lib/utils"

interface MobileContentTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileContentTabs({ activeTab, onTabChange }: MobileContentTabsProps) {
  const tabs = [
    { id: "articles", label: "ARTICLES" },
    { id: "entete", label: "ENTETE" },
  ]

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-8 py-4 font-semibold text-sm transition-colors flex-1",
            activeTab === tab.id ? "bg-blue-700 text-white" : "bg-white text-gray-800 hover:bg-gray-100",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
