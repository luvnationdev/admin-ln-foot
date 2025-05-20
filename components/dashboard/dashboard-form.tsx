"use client";

import ContentTabs from "@/components/content-tabs";
import ArticlesForm from "@/components/dashboard/mobile/articles-form";
import { useState } from "react";
import { ProductForm } from "./mobile/product-form";

type Tab = {
  id: string;
  label: string;
};

interface MobileDashboardProps {
  tabs: Tab[];
}

export default function DashboardForm({ tabs }: MobileDashboardProps) {
  const [contentTab, setContentTab] = useState(tabs[0].id);

  // Déterminer le titre de la section en fonction de l'onglet actif
  const getSectionTitle = () => {
    switch (contentTab) {
      case "products":
        return "INSERTION DES PRODUITS";
      default:
        return "INSERTION DES ARTICLES";
    }
  };

  // Déterminer le titre du formulaire en fonction de l'onglet actif
  const getFormTitle = () => {
    switch (contentTab) {
      case "products":
        return "Formulaire de Produits";
      default:
        return "Formulaire d'Articles";
    }
  };

  // Afficher le formulaire approprié en fonction de l'onglet actif
  const renderForm = () => {
    switch (contentTab) {
      case "products":
        return <ProductForm />
      default:
        return <ArticlesForm />;
    }
  };

  return (
    <>
      <div className="relative flex items-center h-full px-8">
        <h1 className="text-2xl font-bold text-white">{getSectionTitle()}</h1>
      </div>
      <div className="max-w-6xl px-4 mx-auto my-6">
        <ContentTabs
          activeTab={contentTab}
          onTabChange={setContentTab}
          tabs={tabs}
        />
        <h2 className="my-6 text-2xl font-bold">{getFormTitle()}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
          <div className="p-4 border rounded-md">{renderForm()}</div>
        </div>
      </div>
    </>
  );
}
