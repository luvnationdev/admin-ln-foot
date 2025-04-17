"use client"

import { useState } from "react"
import Image from "next/image"
import ContentTabs from "@/components/content-tabs"
import ActualitesForm from "@/components/dashboard/web/actualites-form"
import PublicitesForm from "@/components/dashboard/web/publicites-form"
import PointsFortsForm from "@/components/dashboard/web/points-forts-form"
import Preview from "@/components/preview"

export default function Dashboard() {
  const [navTab, setNavTab] = useState("site-web")
  const [contentTab, setContentTab] = useState("actualites")

  // Déterminer le titre de la section en fonction de l'onglet actif
  const getSectionTitle = () => {
    switch (contentTab) {
      case "actualites":
        return "INSERTION DES ACTUALITES"
      case "publicites":
        return "INSERTION DES PUBLICITES"
      case "points-forts":
        return "INSERTION DES POINTS FORTS"
      default:
        return "INSERTION DES ACTUALITES"
    }
  }

  // Déterminer le titre du formulaire en fonction de l'onglet actif
  const getFormTitle = () => {
    switch (contentTab) {
      case "actualites":
        return "Formulaire d'Actualité"
      case "publicites":
        return "Formulaire Publicité"
      case "points-forts":
        return "Formulaire Point fort"
      default:
        return "Formulaire d'Actualité"
    }
  }

  // Afficher le formulaire approprié en fonction de l'onglet actif
  const renderForm = () => {
    switch (contentTab) {
      case "actualites":
        return <ActualitesForm />
      case "publicites":
        return <PublicitesForm />
      case "points-forts":
        return <PointsFortsForm />
      default:
        return <ActualitesForm />
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
        <ContentTabs activeTab={contentTab} onTabChange={setContentTab} />

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
