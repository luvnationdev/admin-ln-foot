"use client"

import { useState } from "react"
import Image from "next/image"
import MobileContentTabs from "@/components/mobile-content-tabs"
import ArticlesForm from "@/components/dashboard/mobile/articles-form"
import EnteteForm from "@/components/dashboard/mobile/entete-form"
import Preview from "@/components/preview"

export default function MobileDashboard() {
  const [navTab, setNavTab] = useState("mobile")
  const [contentTab, setContentTab] = useState("articles")

  // Déterminer le titre de la section en fonction de l'onglet actif
  const getSectionTitle = () => {
    switch (contentTab) {
      case "articles":
        return "INSERTION DES ARTICLES"
      case "entete":
        return "INSERTION DE L'ENTETE"
      default:
        return "INSERTION DES ARTICLES"
    }
  }

  // Déterminer le titre du formulaire en fonction de l'onglet actif
  const getFormTitle = () => {
    switch (contentTab) {
      case "articles":
        return "Formulaire d'Articles"
      case "entete":
        return "Formulaire d'Entete"
      default:
        return "Formulaire d'Articles"
    }
  }

  // Afficher le formulaire approprié en fonction de l'onglet actif
  const renderForm = () => {
    switch (contentTab) {
      case "articles":
        return <ArticlesForm />
      case "entete":
        return <EnteteForm />
      default:
        return <ArticlesForm />
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero Banner with Section Title */}
      <div className="relative w-full h-32">
        <div className="absolute inset-0">
          <Image src="/stadium-background.jpg" alt="Stadium" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40"></div>
        </div>
        <div className="relative flex items-center h-full px-8">
          <h1 className="text-2xl font-bold text-white">{getSectionTitle()}</h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl px-4 mx-auto my-6">
        {/* Content Tabs */}
        <MobileContentTabs activeTab={contentTab} onTabChange={setContentTab} />

        {/* Form Title */}
        <h2 className="my-6 text-2xl font-bold text-center">{getFormTitle()}</h2>

        {/* Form and Preview */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-4 border rounded-md">{renderForm()}</div>
          <div className="h-96 md:h-auto">
            <Preview />
          </div>
        </div>
      </div>
    </main>
  )
}
